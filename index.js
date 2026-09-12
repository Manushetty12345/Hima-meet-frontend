/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType, AndroidCategory } from '@notifee/react-native';

const BACKEND_URL = 'https://himameet-backend.onrender.com';

// ── Create the incoming call notification channel ──
const ensureChannelExists = async () => {
  try {
    await notifee.createChannel({
      id: 'incoming_calls_v3', // Changed ID to force Android to register new settings (ringtone)
      name: 'Incoming Calls',
      importance: AndroidImportance.HIGH,
      sound: 'ringtone', // Uses the custom ringtone.mp3 in res/raw
      vibration: true,
    });
  } catch (e) {
    console.log('Failed to create channel:', e);
  }
};

// ── Handle FCM messages when app is KILLED or BACKGROUND ──
try {
  const messagingInstance = getMessaging();
  messagingInstance.setBackgroundMessageHandler(async remoteMessage => {
    console.log('[FCM] Background message received:', remoteMessage);
    if (remoteMessage?.data?.type !== 'incoming_call') return;

    const { callId, callerName, callType } = remoteMessage.data || {};
    const callTypeLabel = callType === 'video' ? '📹 Video' : '📞 Voice';

    try {
      await ensureChannelExists();
      
      if (notifee && notifee.displayNotification) {
        // Show a notification with Accept & Decline action buttons
        await notifee.displayNotification({
          id: `call_${callId}`,
          title: `${callTypeLabel} Call`,
          body: `${callerName || 'Someone'} is calling you`,
          android: {
            channelId: 'incoming_calls_v3',
            importance: AndroidImportance.HIGH,
            largeIcon: remoteMessage.data?.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-avatar.png',
            circularLargeIcon: true,
            category: AndroidCategory.CALL, // Tells Android this is a call to show as heads-up
            autoCancel: false,
            ongoing: true,
            loopSound: true, // Loops the ringtone
            asForegroundService: false,
            fullScreenAction: { id: 'default' }, // Wakes up the screen when locked!
            pressAction: { id: 'default', launchActivity: 'default' },
            actions: [
              {
                title: '✅ Accept',
                pressAction: { id: 'accept', launchActivity: 'default' },
              },
              {
                title: '❌ Decline',
                pressAction: { id: 'decline' },
              },
            ],
          },
        });
        console.log('[Notifee] Displayed background call notification');
      }
    } catch (e) {
      console.error('Failed to display background notification', e);
    }
  });
} catch (err) {
  console.log('Error setting up FCM background handler:', err);
}

// ── Handle notifee button presses in background/killed state ──
try {
  if (notifee && notifee.onBackgroundEvent) {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      if (!notification?.id) return;

      const callId = notification.id.replace('call_', '');
      console.log(`[Notifee] Background event: ${type}, action: ${pressAction?.id}`);

      if (type === EventType.ACTION_PRESS && pressAction?.id === 'decline') {
        try {
          await fetch(`${BACKEND_URL}/api/calls/${callId}/decline`, { method: 'POST' });
        } catch (e) {}
        await notifee.cancelNotification(notification.id);
      }

      if (type === EventType.ACTION_PRESS && pressAction?.id === 'accept') {
        await notifee.cancelNotification(notification.id);
      }

      if (type === EventType.DISMISSED) {
        await notifee.cancelNotification(notification.id);
      }
    });
  }
} catch (err) {
  console.log('Error setting up Notifee background event:', err);
}

AppRegistry.registerComponent(appName, () => App);

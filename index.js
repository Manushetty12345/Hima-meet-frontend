/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType, AndroidCategory } from '@notifee/react-native';
import InCallManager from 'react-native-incall-manager';

const BACKEND_URL = 'https://himameet-backend.onrender.com';

// ── Create the incoming call notification channel ──
const ensureChannelExists = async () => {
  try {
    await notifee.createChannel({
      id: 'incoming_calls_v4', // Changed ID to wipe out the old ringtone settings
      name: 'Incoming Calls',
      importance: AndroidImportance.HIGH,
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
    if (remoteMessage?.data?.type === 'call_cancelled') {
      const { callId } = remoteMessage.data || {};
      if (callId) {
        await notifee.cancelNotification(`call_${callId}`);
        InCallManager.stopRingtone();
        console.log(`[Notifee] Cancelled notification for call_${callId}`);
      }
      return;
    }

    if (remoteMessage?.data?.type !== 'incoming_call') return;

    const { callId, callerName, callType } = remoteMessage.data || {};
    const callTypeLabel = callType === 'video' ? '📹 Video' : '📞 Voice';

    try {
      await ensureChannelExists();
      
      // Start the native default ringtone from the background task!
      InCallManager.startRingtone('_DEFAULT_');
      
      if (notifee && notifee.displayNotification) {
        // Show a notification with Accept & Decline action buttons
        await notifee.displayNotification({
          id: `call_${callId}`,
          title: `${callTypeLabel} Call`,
          body: `${callerName || 'Someone'} is calling you`,
          android: {
            channelId: 'incoming_calls_v4',
            importance: AndroidImportance.HIGH,
            largeIcon: remoteMessage.data?.avatar_url || 'https://hima-bucket.s3.amazonaws.com/default-avatar.png',
            circularLargeIcon: true,
            category: AndroidCategory.CALL, // Tells Android this is a call to show as heads-up
            autoCancel: false,
            ongoing: true,
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
        InCallManager.stopRingtone();
      }

      if (type === EventType.ACTION_PRESS && pressAction?.id === 'accept') {
        await notifee.cancelNotification(notification.id);
        InCallManager.stopRingtone();
      }

      if (type === EventType.DISMISSED) {
        await notifee.cancelNotification(notification.id);
        InCallManager.stopRingtone();
      }
    });
  }
} catch (err) {
  console.log('Error setting up Notifee background event:', err);
}

AppRegistry.registerComponent(appName, () => App);

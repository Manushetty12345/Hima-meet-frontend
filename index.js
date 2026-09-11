/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const BACKEND_URL = 'https://himameet-backend.onrender.com';

// ── Create the incoming call notification channel ──
const ensureChannelExists = async () => {
  try {
    await notifee.createChannel({
      id: 'incoming_calls',
      name: 'Incoming Calls',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  } catch (e) {
    console.log('Failed to create channel:', e);
  }
};

// ── Handle FCM messages when app is KILLED or BACKGROUND ──
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM] Background message received:', remoteMessage);
  if (remoteMessage?.data?.type !== 'incoming_call') return;

  const { callId, callerName, callType } = remoteMessage.data || {};
  const callTypeLabel = callType === 'video' ? '📹 Video' : '📞 Voice';

  try {
    await ensureChannelExists();
    
    // Show a notification with Accept & Decline action buttons
    await notifee.displayNotification({
      id: `call_${callId}`,
      title: `${callTypeLabel} Call`,
      body: `${callerName || 'Someone'} is calling you`,
      android: {
        channelId: 'incoming_calls',
        importance: AndroidImportance.HIGH,
        ongoing: true,
        asForegroundService: false,
        pressAction: { id: 'default' },
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
  } catch (e) {
    console.error('Failed to display background notification', e);
  }
});

// ── Handle notifee button presses in background/killed state ──
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

AppRegistry.registerComponent(appName, () => App);

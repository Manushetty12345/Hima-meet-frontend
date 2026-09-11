/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const BACKEND_URL = 'https://himameet-backend.onrender.com';

// ── Create the incoming call notification channel (Android 8+) ──
notifee.createChannel({
  id: 'incoming_calls',
  name: 'Incoming Calls',
  importance: AndroidImportance.HIGH,
  sound: 'default',
  vibration: true,
});

// ── Handle FCM messages when app is KILLED or BACKGROUND ──
messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage?.data?.type !== 'incoming_call') return;

  const { callId, callerName, callType } = remoteMessage.data as any;
  const callTypeLabel = callType === 'video' ? '📹 Video' : '📞 Voice';

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
});

// ── Handle notifee button presses in background/killed state ──
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (!notification?.id) return;

  const callId = notification.id.replace('call_', '');

  if (type === EventType.ACTION_PRESS && pressAction?.id === 'decline') {
    // Emit decline to backend via HTTP so socket isn't needed
    try {
      await fetch(`${BACKEND_URL}/api/calls/${callId}/decline`, { method: 'POST' });
    } catch (e) {}
    await notifee.cancelNotification(notification.id);
  }

  if (type === EventType.ACTION_PRESS && pressAction?.id === 'accept') {
    // App will open (launchActivity: 'default') and handle via getInitialNotification
    await notifee.cancelNotification(notification.id);
  }

  if (type === EventType.DISMISSED) {
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);

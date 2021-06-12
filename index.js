/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
import { NotificationChannel } from './src/common/constants/common';
import { ActionType } from './src/FCM/constants';
import {
  handlePressNewPostNotification,
  handlePressNewCommentNotification,
  handlePressNewMessageNotification,
} from './src/FCM/handlers';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: async function (notification) {
    console.log('NOTIFICATION:', notification);

    /** Process when user click on the notification on notification bar */
    if (notification.userInteraction) {
      switch (notification.data.actionType) {
        case ActionType.NEW_POST: {
          await handlePressNewPostNotification(notification.data);
          break;
        }
        case ActionType.NEW_COMMENT: {
          await handlePressNewCommentNotification(notification.data);
          break;
        }
        case ActionType.NEW_MESSAGE: {
          handlePressNewMessageNotification();
          break;
        }
      }
    }

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

// POST NOTIFICATION CHANNEL
PushNotification.createChannel(
  {
    channelId: NotificationChannel.POST_NOTIFICATION_CHANNEL, // (required)
    channelName: 'Post notification', // (required)
    channelDescription: 'Channel for post and comment notification', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  created => console.log(`created post notification channel '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

// MESSAGE NOTIFICATION CHANNEL
PushNotification.createChannel(
  {
    channelId: NotificationChannel.MESSAGE_NOTIFICATION_CHANNEL,
    channelName: 'Message notification',
    channelDescription: 'Channel for message notification',
    playSound: true,
    soundName: 'beyond_doubt_2.mp3',
    importance: Importance.HIGH,
    vibrate: true,
  },
  created => console.log(`created message notification channel '${created}'`)
);

AppRegistry.registerComponent(appName, () => App);

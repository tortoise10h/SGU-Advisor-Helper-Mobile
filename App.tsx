import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Root from './src/common/HOCS/Root';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import {
  getFCMToken,
  handleNewCommentBackground,
  handleNewCommentForeground,
  handleNewMessageForeground,
  handleNewPostBackground,
  handleNewPostForeground,
} from './src/FCM/handlers';
import { ActionType } from './src/FCM/constants';

const App = () => {
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
      getFCMToken();
    } catch (error) {
      // User has rejected permissions
      console.log('Request FCM permission denied');
    }
  };

  const checkPermission = async () => {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFCMToken();
    } else {
      requestPermission();
    }
  };

  /** Foreground FCM handler */
  useEffect(() => {
    checkPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[remoteMessage] message on the foreground: ', remoteMessage);
      if (remoteMessage.data) {
        switch (remoteMessage.data.actionType) {
          case ActionType.NEW_MESSAGE: {
            handleNewMessageForeground(remoteMessage);
            break;
          }

          case ActionType.NEW_COMMENT: {
            handleNewCommentForeground(remoteMessage);
            break;
          }

          case ActionType.NEW_POST: {
            handleNewPostForeground(remoteMessage);
            break;
          }

          default:
            break;
        }
      }
    });

    return unsubscribe;
  }, []);

  /** Background & Quit FCM handler */
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[remoteMessage] Message handled in the background!', remoteMessage);
    if (remoteMessage.data) {
      switch (remoteMessage.data.actionType) {
        case ActionType.NEW_MESSAGE: {
          handleNewMessageForeground(remoteMessage);
          break;
        }

        case ActionType.NEW_COMMENT: {
          handleNewCommentBackground(remoteMessage);
          break;
        }

        case ActionType.NEW_POST: {
          handleNewPostBackground(remoteMessage);
          break;
        }

        default:
          break;
      }
    }
  });

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <Root />
          <Toast ref={ref => Toast.setRef(ref)} />
        </SafeAreaProvider>
      </Provider>
    </>
  );
};

export default App;

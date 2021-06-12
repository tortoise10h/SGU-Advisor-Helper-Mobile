import messaging from '@react-native-firebase/messaging';
import { PersistHandlers, PersistKeys } from '../common/persistent-store';
import PushNotification from 'react-native-push-notification';
import { setMoreMessagesSagaAction } from '../redux/state/message/saga-types';
import store from '../redux/store';
import { getCurrentRouteName, navigate } from '../common/utils/root-navigation';
import ScreenName from '../common/constants/screen-name';
import {
  pushCommonNotiSagaAction,
  pushMessageNotiSagaAction,
  toggleLoadingAction,
} from '../redux/state/global/saga-types';
import { setMoreUnReadMessages } from '../redux/state/message/slice';
import { setCommentLastChangedAt } from '../redux/state/comment/slice';
import { setPostLastChangedAt } from '../redux/state/post/slice';
import { getPostById } from '../redux/state/post/effects';

export const getFCMToken = async () => {
  let fcmToken = await PersistHandlers.getItem(PersistKeys.FCM_TOKEN_KEY);
  console.log('token = ', fcmToken);
  if (!fcmToken) {
    fcmToken = await messaging().getToken();
    console.log('token = ', fcmToken);
    if (fcmToken) {
      await PersistHandlers.setItem(PersistKeys.FCM_TOKEN_KEY, fcmToken);
    }
  }

  return fcmToken;
};

export const handleNewMessageForeground = (remoteMessage: any) => {
  const messagesStr = remoteMessage.data ? remoteMessage.data.messages : null;

  if (messagesStr) {
    console.log('[handleNewMessageForeground] messagesStr: ', messagesStr);
    let messagesData = JSON.parse(messagesStr);
    const sender = JSON.parse(remoteMessage.data.sender);
    messagesData = messagesData.map((value: any) => {
      return {
        ...value,
        sender,
      };
    });
    console.log('[handleNewMessageForeground] messagesData: ', messagesData);

    store.dispatch({
      type: setMoreMessagesSagaAction.type,
      payload: {
        messages: messagesData,
      },
    });

    const currentScreen = getCurrentRouteName();
    const chatScreenStr: string = ScreenName.PROFESSOR_CHAT_ZONE_SCREEN;

    /** Only do these things if user are not in Chat screen */
    if (currentScreen.localeCompare(chatScreenStr) !== 0) {
      /** Increase unread messages */
      store.dispatch({
        type: setMoreUnReadMessages.type,
        payload: {
          newMessages: messagesData.length,
        },
      });

      /** Puhs message notification */
      PushNotification.getChannels((channelids: string[]) => {
        console.log(channelids); // ['channel_id_1']
      });
      const displayNotiMessage =
        messagesData[0].content.length > 150
          ? messagesData[0].content.slice(0, 150)
          : messagesData[0].content;
      console.log('[handleNewMessageForeground] displayNotiMessage: ', displayNotiMessage);
      store.dispatch({
        type: pushMessageNotiSagaAction.type,
        payload: {
          title: `${messagesData[0].sender.lastName} ${messagesData[0].sender.firstName}`,
          message: displayNotiMessage,
          data: messagesData,
        },
      });
    }
  }
};

export const handleNewMessageBackground = (remoteMessage: any) => {
  const messagesStr = remoteMessage.data ? remoteMessage.data.messages : null;

  if (messagesStr) {
    console.log('[handleNewMessageBackground] messagesStr: ', messagesStr);
    let messagesData = JSON.parse(messagesStr);
    const sender = JSON.parse(remoteMessage.data.sender);
    messagesData = messagesData.map((value: any) => {
      return {
        ...value,
        sender,
      };
    });
    console.log('[handleNewMessageBackground] messagesData: ', messagesData);

    /** Increase unread messages */
    store.dispatch({
      type: setMoreUnReadMessages.type,
      payload: {
        newMessages: messagesData.length,
      },
    });
    store.dispatch({
      type: setMoreMessagesSagaAction.type,
      payload: {
        messages: messagesData,
      },
    });
  }
};

export const handleNewCommentForeground = (remoteMessage: any) => {
  const commentData = remoteMessage.data
    ? remoteMessage.data.author && remoteMessage.data.commentId
      ? remoteMessage.data
      : null
    : null;

  if (commentData) {
    console.log('[handleNewCommentForeground] commentData: ', commentData);
    const author = JSON.parse(commentData.author);
    console.log('[handleNewCommentForeground] author: ', author);

    store.dispatch({
      type: setCommentLastChangedAt.type,
    });
    store.dispatch({
      type: setPostLastChangedAt.type,
    });
    store.dispatch({
      type: pushCommonNotiSagaAction.type,
      payload: {
        title: `${author.lastName} ${author.firstName}`,
        message: 'Đã bình luận vào bài viết',
        data: remoteMessage.data,
      },
    });
  }
};

export const handleNewCommentBackground = (remoteMessage: any) => {
  const commentData = remoteMessage.data
    ? remoteMessage.data.author && remoteMessage.data.commentId
      ? remoteMessage.data
      : null
    : null;

  if (commentData) {
    console.log('[handleNewCommentBackground] commentData: ', commentData);
    const author = JSON.parse(commentData.author);
    console.log('[handleNewCommentBackground] author: ', author);

    store.dispatch({
      type: setCommentLastChangedAt.type,
    });
    store.dispatch({
      type: setPostLastChangedAt.type,
    });
  }
};

export const handleNewPostForeground = (remoteMessage: any) => {
  const postData = remoteMessage.data
    ? remoteMessage.data.author && remoteMessage.data.postId
      ? remoteMessage.data
      : null
    : null;

  if (postData) {
    console.log('[handleNewPostForeground] commentData: ', postData);
    const author = JSON.parse(postData.author);
    console.log('[handleNewPostForeground] author: ', author);

    store.dispatch({
      type: setPostLastChangedAt.type,
    });
    store.dispatch({
      type: pushCommonNotiSagaAction.type,
      payload: {
        title: `${author.lastName} ${author.firstName}`,
        message: 'Đã đăng một thông báo mới',
        data: postData,
      },
    });
  }
};

export const handleNewPostBackground = (remoteMessage: any) => {
  const postData = remoteMessage.data
    ? remoteMessage.data.author && remoteMessage.data.postId
      ? remoteMessage.data
      : null
    : null;

  if (postData) {
    console.log('[handleNewPostBackground] commentData: ', postData);
    const author = JSON.parse(postData.author);
    console.log('[handleNewPostBackground] author: ', author);

    store.dispatch({
      type: setPostLastChangedAt.type,
    });
  }
};

export const handlePressNewPostNotification = async (data: any) => {
  try {
    console.log('[handlePressNewPostNotification] data: ', data);
    console.log(
      '🔥🔥🔥  ▶️  file: handlers.ts  ▶️  line 215  ▶️  handlePressNewPostNotification  ▶️  store',
      store
    );
    store.dispatch({
      type: toggleLoadingAction.type,
    });

    const getPostResult = await getPostById(data.classroomId, data.postId);
    console.log('[handlePressNewPostNotification] post: ', getPostResult?.data);
    store.dispatch({
      type: toggleLoadingAction.type,
    });
    const postStr = JSON.stringify(getPostResult?.data);
    navigate(ScreenName.FEED_DETAIL_SCREEN, {
      feed: postStr,
    });
  } catch (error) {
    store.dispatch({
      type: toggleLoadingAction.type,
    });
    console.log('[handlePressNewPostNotification] error: ', error);
  }
};

export const handlePressNewCommentNotification = async (data: any) => {
  try {
    console.log('[handlePressNewCommentNotification] data: ', data);
    store.dispatch({
      type: toggleLoadingAction.type,
    });

    const getPostResult = await getPostById(data.classroomId, data.posstId);
    console.log('[handlePressNewCommentNotification] post: ', getPostResult?.data);
    store.dispatch({
      type: toggleLoadingAction.type,
    });
    const postStr = JSON.stringify(getPostResult?.data);
    navigate(ScreenName.FEED_DETAIL_SCREEN, {
      feed: postStr,
    });
  } catch (error) {
    store.dispatch({
      type: toggleLoadingAction.type,
    });
    console.log('[handlePressNewCommentNotification] error: ', error);
  }
};

export const handlePressNewMessageNotification = () => {
  try {
    navigate(ScreenName.PROFESSOR_CHAT_ZONE_SCREEN);
  } catch (error) {
    console.log('[handlePressNewMessageNotification] error: ', error);
  }
};

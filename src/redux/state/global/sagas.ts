import { put, takeLatest, fork, all } from 'typed-redux-saga';
import { toggleLoading } from './slice';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
  toastSuccessSagaAction,
  pushMessageNotiSagaAction,
  pushCommonNotiSagaAction,
} from './saga-types';
import Toast from 'react-native-toast-message';
import PushNotification from 'react-native-push-notification';
import { NotificationChannel } from '../../../common/constants/common';

export function* handleGlobalError(action: any) {
  console.log('[handleGlobalError] action: ', action);
  try {
    console.log('[handleGlobalError] action: ', action);
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Có lỗi xảy ra',
      text2: action.payload.error,
    });
  } catch (err) {
    console.log('[handleGlobalError] err: ', err);
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Có lỗi xảy ra',
      text2: 'Server error',
    });
  }
}

export function* handleToastSuccess(action: any) {
  try {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: action.payload.title,
      text2: action.payload.content,
    });
  } catch (err) {
    console.log('[handleToastSuccess] err: ', err);
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Có lỗi xảy ra',
      text2: 'Server error',
    });
  }
}

export function* handleToggleGlobalLoading() {
  try {
    yield put(toggleLoading());
  } catch (err) {
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handlePushMessageNotification(action: any) {
  console.log('[handlePushMessageNotification] action: ', action);
  PushNotification.localNotification({
    ignoreInForeground: false,
    message: action.payload.message,
    title: action.payload.title,
    userInfo: action.payload.data,
    channelId: NotificationChannel.MESSAGE_NOTIFICATION_CHANNEL,
  });
}

export function* handlePushCommonNotification(action: any) {
  console.log('[handlePushCommonNotification] action: ', action);
  PushNotification.localNotification({
    ignoreInForeground: false,
    message: action.payload.message,
    title: action.payload.title,
    userInfo: action.payload.data,
    channelId: NotificationChannel.POST_NOTIFICATION_CHANNEL,
  });
}

export function* watchEveryGlobalError() {
  yield takeLatest(setGlobalErrorAction(null).type, handleGlobalError);
}

export function* watchEveryPushMessageNotification() {
  yield takeLatest(pushMessageNotiSagaAction(null).type, handlePushMessageNotification);
}

export function* watchEveryPushCommonNotification() {
  yield takeLatest(pushCommonNotiSagaAction(null).type, handlePushCommonNotification);
}

export function* watchLastestLoading() {
  yield takeLatest(toggleLoadingAction(null).type, handleToggleGlobalLoading);
}

export function* watchLastestToastSuccess() {
  yield takeLatest(toastSuccessSagaAction(null).type, handleToastSuccess);
}

export default function* errorSaga() {
  yield all([
    fork(watchEveryGlobalError),
    fork(watchLastestLoading),
    fork(watchLastestToastSuccess),
    fork(watchEveryPushMessageNotification),
    fork(watchEveryPushCommonNotification),
  ]);
}

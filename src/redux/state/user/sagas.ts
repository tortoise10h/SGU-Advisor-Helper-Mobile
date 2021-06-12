import { put, takeLatest, fork, all, call } from 'typed-redux-saga';
import {
  getInfoBySGUId,
  login,
  registerNewAccount,
  removeUserFCMToken,
  setUserFCM,
} from './effects';
import { setUserInfo, setLoginAt } from './slice';
import { setCurrentClassData } from '../class/slice';
import { loginAction, logoutAction, regiserAction, getUserInfoBySguIdAction } from './saga-types';
import { setGlobalErrorAction, toggleLoadingAction } from '../global/saga-types';
import { PersistKeys, PersistHandlers } from '../../../common/persistent-store';
import { UserRole } from '../../../common/constants/user';
import { getFCMToken } from '../../../FCM/handlers';
import { getMyClasses } from '../class/effects';

export function* handleLogin(action: any) {
  try {
    console.log('[handleLogin] action: ', action);
    yield put({ type: toggleLoadingAction.type });

    const { sguId, password }: { sguId: string; password: string } = action.payload.loginInfo;
    const result = yield* call(login, sguId, password);

    if (result) {
      console.log('[handleLogin] action.payload.userInfo: ', action.payload.userInfo);
      const setUserInfoAction = setUserInfo(action.payload.userInfo);
      const userToken = JSON.stringify(result.data);
      const role = action.payload.userInfo.role;
      let fcmToken = yield* call(PersistHandlers.getItem, PersistKeys.FCM_TOKEN_KEY);
      if (!fcmToken) {
        fcmToken = yield* call(getFCMToken);
      }
      console.log('[handleLogin] fcmToken: ', fcmToken);

      yield put({ type: setUserInfoAction.type, payload: setUserInfoAction.payload });
      yield put({ type: setLoginAt.type });
      yield* call(PersistHandlers.setItem, PersistKeys.USER_TOKEN_KEY, userToken);
      yield* call(PersistHandlers.setItem, PersistKeys.USER_ROLE_KEY, role);
      yield* call(
        PersistHandlers.setItem,
        PersistKeys.USER_SGU_ID_KEY,
        action.payload.userInfo.sguId
      );
      /** should go after set token to persist storage */
      yield* call(setUserFCM, <string>fcmToken);

      /** because if you are a student you don't have an option to choose class */
      if (role === UserRole.STUDENT) {
        const studentClassesResult = yield* call(getMyClasses);
        const studentClasses = studentClassesResult.data.data;
        const setCurrentClassDataAction = setCurrentClassData(studentClasses[0]);
        yield put({
          type: setCurrentClassDataAction.type,
          payload: setCurrentClassDataAction.payload,
        });
      }
    }
    yield put({ type: toggleLoadingAction.type });
  } catch (err) {
    yield put({ type: toggleLoadingAction.type });
    console.log('[handleLogin] err: ', err);
  }
}

export function* handleRegister(action: any) {
  try {
    yield put({ type: toggleLoadingAction.type });

    const result = yield* call(registerNewAccount, action.payload);
    const userInfoResult = yield* call(getInfoBySGUId, action.payload.studentId);

    const setUserInfoAction = setUserInfo(userInfoResult.data);
    const userToken = JSON.stringify(result.data);
    const role = action.payload.userInfo.role;
    let fcmToken = yield* call(PersistHandlers.getItem, PersistKeys.FCM_TOKEN_KEY);
    if (!fcmToken) {
      fcmToken = yield* call(getFCMToken);
    }
    console.log('[handleRegister] fcmToken: ', fcmToken);

    yield put({ type: setUserInfoAction.type, payload: setUserInfoAction.payload });
    yield put({ type: setLoginAt.type });
    yield* call(PersistHandlers.setItem, PersistKeys.USER_TOKEN_KEY, userToken);
    yield* call(PersistHandlers.setItem, PersistKeys.USER_ROLE_KEY, role);
    yield* call(PersistHandlers.setItem, PersistKeys.USER_ROLE_KEY, role);

    /** should go after set token to persist storage */
    yield* call(setUserFCM, <string>fcmToken);

    /** because if you are a student you don't have an option to choose class */
    if (role === UserRole.STUDENT) {
      const studentClassesResult = yield* call(getMyClasses);
      const studentClasses = studentClassesResult.data.data;
      const setCurrentClassDataAction = setCurrentClassData(studentClasses[0]);
      yield put({
        type: setCurrentClassDataAction.type,
        payload: setCurrentClassDataAction.payload,
      });
    }

    yield put({ type: toggleLoadingAction.type });
  } catch (err) {
    console.log('[handleRegister] err: ', err);
    yield put({ type: toggleLoadingAction.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* logoutAsync() {
  try {
    yield put({ type: toggleLoadingAction.type });
    const fcmToken = yield* call(PersistHandlers.getItem, PersistKeys.FCM_TOKEN_KEY);
    yield* call(removeUserFCMToken, <string>fcmToken);
    const setUserInfoAction = setUserInfo({});
    yield put({ type: setLoginAt.type });
    yield put({ type: setUserInfoAction.type, payload: setUserInfoAction.payload });
    yield* call(PersistHandlers.setItem, PersistKeys.USER_TOKEN_KEY, '');
    yield* call(PersistHandlers.setItem, PersistKeys.USER_ROLE_KEY, '');
    yield* call(PersistHandlers.setItem, PersistKeys.USER_SGU_ID_KEY, '');
    yield* call(PersistHandlers.setItem, PersistKeys.FCM_TOKEN_KEY, '');
    yield put({ type: toggleLoadingAction.type });
  } catch (err) {
    console.log('[logoutAsync] err: ', err);
    yield put({ type: toggleLoadingAction.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* getUserInfoBySguIdAsync(action: any) {
  try {
    yield put({ type: toggleLoadingAction.type });
    const userInfoResult = yield* call(getInfoBySGUId, action.payload.sguId);
    if (userInfoResult) {
      const userInfo = userInfoResult.data;
      console.log('[getUserInfoBySguIdAsync] userInfo: ', userInfo);
      const setUserInfoAction = setUserInfo(userInfo);
      if (userInfo.role === UserRole.STUDENT) {
        const studentClassesResult = yield* call(getMyClasses);
        const studentClasses = studentClassesResult.data.data;
        const setCurrentClassDataAction = setCurrentClassData(studentClasses[0]);
        yield put({
          type: setCurrentClassDataAction.type,
          payload: setCurrentClassDataAction.payload,
        });
      }
      yield put({ type: setUserInfoAction.type, payload: setUserInfoAction.payload });
    }
    yield put({ type: toggleLoadingAction.type });
  } catch (err) {
    yield put({ type: toggleLoadingAction.type });
    console.log('[getUserInfoBySguIdAsync] err: ', err);
  }
}

export function* watchLoginLastestAsync() {
  yield takeLatest(loginAction(null).type, handleLogin);
}

export function* watchLogoutLastestAsync() {
  yield takeLatest(logoutAction(null).type, logoutAsync);
}

export function* watchLastestHandleRegister() {
  yield takeLatest(regiserAction(null).type, handleRegister);
}

export function* watchGetUserInfoBySguIdLastest() {
  yield takeLatest(getUserInfoBySguIdAction(null).type, getUserInfoBySguIdAsync);
}

export default function* userSaga() {
  yield all([
    fork(watchLoginLastestAsync),
    fork(watchLogoutLastestAsync),
    fork(watchLastestHandleRegister),
    fork(watchGetUserInfoBySguIdLastest),
  ]);
}

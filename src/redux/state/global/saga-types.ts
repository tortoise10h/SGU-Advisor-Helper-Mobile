import { createAction } from '@reduxjs/toolkit';

export const toggleLoadingAction = createAction<any | undefined>('@@global/TOGGLE_LOADING');
export const setGlobalErrorAction = createAction<any | undefined>('@@global/SET_GLOBAL_ERROR');
export const toastSuccessSagaAction = createAction<any | undefined>('@@global/TOAST_SUCCESS');
export const pushMessageNotiSagaAction = createAction<any | undefined>('@@global/PUSH_MESSAGE_NOTIFICATION');
export const pushCommonNotiSagaAction = createAction<any | undefined>('@@global/PUSH_COMMON_NOTI_SAGA_ACTION');

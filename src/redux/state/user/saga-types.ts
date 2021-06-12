import { createAction } from '@reduxjs/toolkit';

export const loginAction = createAction<any | undefined>('@@user/LOGIN');
export const logoutAction = createAction<any | undefined>('@@user/LOGOUT');
export const regiserAction = createAction<any | undefined>('@@user/REGISTER');
export const getUserInfoBySguIdAction = createAction<any | undefined>('@@user/GET_INFO_BY_SGU_ID');

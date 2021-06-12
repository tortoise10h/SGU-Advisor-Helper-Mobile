import { createAction } from '@reduxjs/toolkit';

export const sendMessageSagaAction = createAction<any | undefined>('@@message/SEND_MESSAGE');
export const fetchMessagesSagaAction = createAction<any | undefined>('@@message/FETCH_MESSAGES');
export const fetchMoreMessagesSagaAction = createAction<any | undefined>('@@message/FETCH_MORE_MESSAGES');
export const setMoreMessagesSagaAction = createAction<any | undefined>('@@message/SET_MORE_MESSAGES');

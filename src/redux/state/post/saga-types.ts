import { createAction } from '@reduxjs/toolkit';

export const fetchPostsSagaAction = createAction<any | undefined>('@@post/FETCH_POSTS');
export const fetchMorePostsSagaAction = createAction<any | undefined>('@@post/FETCH_MORE_POSTS');

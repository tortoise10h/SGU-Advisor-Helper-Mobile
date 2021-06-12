import { createAction } from '@reduxjs/toolkit';

export const fetchCommentsSagaAction = createAction<any | undefined>('@@comment/FETCH_COMMENTS');
export const deleteCommentSagaAction = createAction<any | undefined>('@@comment/DELETE_COMMENT');

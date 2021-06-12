import { put, fork, all, call, takeLatest } from 'typed-redux-saga';
import {
  setComments,
  setCommentPagin,
  setFetchMoreAt,
  refreshComments,
  setCommentLastChangedAt,
} from './slice';
import { deleteCommentSagaAction, fetchCommentsSagaAction } from './saga-types';
import { setGlobalErrorAction } from '../global/saga-types';
import { deleteComment, getComments } from './effects';
import { DEFAULT_PAGE } from '../../../config';
import { toggleProgressBarLoading } from '../global/slice';

export function* handleFetchComments(action: any) {
  try {
    console.log('[handleFetchComments] action: ', action);
    const result = yield* call(getComments, action.payload.postId, action.payload.page);
    /** If page = 1 that's mean get comment from new post from the begining */
    if (action.payload.page === 1) {
      const commentPagin = {
        count: 0,
        currentPage: action.payload.page,
        totalItems: 0,
        pageSize: DEFAULT_PAGE,
        totalPages: 0,
      };
      const setCommentPaginAction = setCommentPagin(commentPagin);

      yield put({ type: refreshComments.type });
      yield put({ type: setCommentPaginAction.type, payload: setCommentPaginAction.payload });
    }

    if (result) {
      let commentsData = result.data.data;
      commentsData = commentsData.reverse();
      const commentPagin = {
        count: result.data.count,
        currentPage: result.data.currentPage,
        totalItems: result.data.totalItems,
        pageSize: result.data.pageSize,
        totalPages: result.data.totalPages,
      };

      const setCommentsDataAction = setComments(commentsData);
      const setCommentPaginAction = setCommentPagin(commentPagin);

      yield put({ type: setCommentsDataAction.type, payload: setCommentsDataAction.payload });
      yield put({ type: setFetchMoreAt.type });
      yield put({ type: setCommentPaginAction.type, payload: setCommentPaginAction.payload });
    }
  } catch (err) {
    console.log('[handleFetchComments] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleDeleteComment(action: any) {
  try {
    console.log('[handleDeleteComment] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });
    yield* call(deleteComment, action.payload.postId, action.payload.commentId);
    yield put({ type: setCommentLastChangedAt.type });
    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    yield put({ type: toggleProgressBarLoading.type });
    console.log('[handleDeleteComment] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* watchLastestFetchComments() {
  yield takeLatest(fetchCommentsSagaAction(null).type, handleFetchComments);
}

export function* watchLastestDeleteComment() {
  yield takeLatest(deleteCommentSagaAction(null).type, handleDeleteComment);
}

export default function* commentSaga() {
  yield all([fork(watchLastestFetchComments), fork(watchLastestDeleteComment)]);
}

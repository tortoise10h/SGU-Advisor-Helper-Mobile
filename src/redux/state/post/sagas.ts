import { put, fork, all, call, takeLatest } from 'typed-redux-saga';
import { setFetchMoreAt, setMorePosts, setPostPagin, setPosts, setRefreshAt } from './slice';
import { fetchPostsSagaAction, fetchMorePostsSagaAction } from './saga-types';
import { setGlobalErrorAction } from '../global/saga-types';
import { getPosts } from './effects';
import { toggleProgressBarLoading } from '../global/slice';

export function* handleFetchPosts(action: any) {
  try {
    console.log('[handleFetchPosts] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });

    const result = yield* call(getPosts, action.payload.classroomId);

    if (result) {
      const postsData = result.data.data;
      const postPagin = {
        count: result.data.count,
        currentPage: result.data.currentPage,
        totalItems: result.data.totalItems,
        pageSize: result.data.pageSize,
        totalPages: result.data.totalPages,
      };

      const setPostsDataAction = setPosts(postsData);
      const setPostPaginAction = setPostPagin(postPagin);

      yield put({ type: setPostsDataAction.type, payload: setPostsDataAction.payload });
      yield put({ type: setPostPaginAction.type, payload: setPostPaginAction.payload });
      yield put({ type: setRefreshAt.type });
    }

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleFetchPosts] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleFetchMorePosts(action: any) {
  try {
    console.log('[handleFetchMorePosts] action: ', action);
    const result = yield* call(getPosts, action.payload.classroomId, action.payload.page);

    if (result) {
      const postsData = result.data.data;
      const postPagin = {
        count: result.data.count,
        currentPage: result.data.currentPage,
        totalItems: result.data.totalItems,
        pageSize: result.data.pageSize,
        totalPages: result.data.totalPages,
      };

      const setMorePostsDataAction = setMorePosts(postsData);
      const setPostPaginAction = setPostPagin(postPagin);

      yield put({ type: setMorePostsDataAction.type, payload: setMorePostsDataAction.payload });
      yield put({ type: setPostPaginAction.type, payload: setPostPaginAction.payload });
      yield put({ type: setFetchMoreAt.type });
    }
  } catch (err) {
    console.log('[handleFetchMorePosts] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* watchLastestFetchPosts() {
  yield takeLatest(fetchPostsSagaAction(null).type, handleFetchPosts);
}

export function* watchLastestFetchMorePosts() {
  yield takeLatest(fetchMorePostsSagaAction(null).type, handleFetchMorePosts);
}

export default function* postSaga() {
  yield all([fork(watchLastestFetchPosts), fork(watchLastestFetchMorePosts)]);
}

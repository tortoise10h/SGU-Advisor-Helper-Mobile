import { put, takeEvery, fork, all, call } from 'typed-redux-saga';
import { getMyClasses } from './effects';
import { setMyClassesData, setCurrentClassData } from './slice';
import { fetchMyClassesSagaAction, setCurrentClassSagaAction } from './saga-types';
import { setGlobalErrorAction, toggleLoadingAction } from '../global/saga-types';

export function* handleFetchMyClasses() {
  try {
    yield put({ type: toggleLoadingAction.type });

    const result = yield* call(getMyClasses);

    if (result) {
      const classesData = result.data.data;
      const setMyClassesDataAction = setMyClassesData(classesData);
      yield put({ type: setMyClassesDataAction.type, payload: setMyClassesDataAction.payload });
    }

    yield put({ type: toggleLoadingAction.type });
  } catch (err) {
    console.log('[handleFetchMyClasses] err: ', err);
    yield put({ type: toggleLoadingAction.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleSetCurrentClass(action: any) {
  try {
    const setCurrentClassAction = setCurrentClassData(action.payload);

    yield put({ type: setCurrentClassAction.type, payload: setCurrentClassAction.payload });
  } catch (err) {
    console.log('[handleSetCurrentClass] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
  }

}

export function* watchEveryFetchMyClasses() {
  yield takeEvery(fetchMyClassesSagaAction(null).type, handleFetchMyClasses);
}

export function* watchEverySetCurrentClass() {
  yield takeEvery(setCurrentClassSagaAction(null).type, handleSetCurrentClass);
}

export default function* classSaga() {
  yield all([fork(watchEveryFetchMyClasses), fork(watchEverySetCurrentClass)]);
}

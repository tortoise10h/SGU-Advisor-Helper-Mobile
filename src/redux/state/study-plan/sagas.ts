import { put, fork, all, call, takeLatest } from 'typed-redux-saga';
import { setStudyPlans, setStudyPlanLastChangedAt } from './slice';
import {
  createStudyPlanSagaAction,
  fetchStudyPlansSagaAction,
  deleteStudyPlanSagaAction,
  updateStudyPlanSagaAction,
} from './saga-types';
import { setGlobalErrorAction } from '../global/saga-types';
import { getStudyPlans, deleteStudyPlan, updateStudyPlan, createStudyPlan } from './effects';
import { toggleProgressBarLoading } from '../global/slice';

export function* handleFetchStudyPlans(action: any) {
  try {
    console.log('[handleFetchStudyPlans] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });

    const result =
      yield *
      call(
        getStudyPlans,
        action.payload.classroomId,
        action.payload.filter,
        action.payload.filterCondition
      );

    if (result) {
      let studyPlansData = result.data.data;
      studyPlansData = studyPlansData.reverse();

      const setStudyPlansDataAction = setStudyPlans(studyPlansData);

      yield put({ type: setStudyPlansDataAction.type, payload: setStudyPlansDataAction.payload });
    }

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleFetchStudyPlans] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleCreateStudyPlan(action: any) {
  try {
    console.log('[handleCreateStudyPlan] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });

    yield* call(createStudyPlan, action.payload.classroomId, action.payload.newStudyPlan);

    yield put({ type: setStudyPlanLastChangedAt.type });

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleCreateStudyPlan] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleUpdateStudyPlan(action: any) {
  try {
    console.log('[handleUpdateStudyPlan] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });

    yield* call(
      updateStudyPlan,
      action.payload.classroomId,
      action.payload.studyPlanId,
      action.payload.studyPlanInfo
    );

    yield put({ type: setStudyPlanLastChangedAt.type });

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleUpdateStudyPlan] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleDeleteStudyPlan(action: any) {
  try {
    console.log('[handleDeleteStudyPlan] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });

    yield* call(deleteStudyPlan, action.payload.classroomId, action.payload.studyPlanId);

    yield put({ type: setStudyPlanLastChangedAt.type });

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleDeleteStudyPlan] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* watchLastestFetchStudyPlans() {
  yield takeLatest(fetchStudyPlansSagaAction(null).type, handleFetchStudyPlans);
}

export function* watchLastestCreateStudyPlan() {
  yield takeLatest(createStudyPlanSagaAction(null).type, handleCreateStudyPlan);
}

export function* watchLastestUpdateStudyPlan() {
  yield takeLatest(updateStudyPlanSagaAction(null).type, handleUpdateStudyPlan);
}

export function* watchLastestDeleteStudyPlan() {
  yield takeLatest(deleteStudyPlanSagaAction(null).type, handleDeleteStudyPlan);
}

export default function* studyPlanSaga() {
  yield all([
    fork(watchLastestFetchStudyPlans),
    fork(watchLastestCreateStudyPlan),
    fork(watchLastestUpdateStudyPlan),
    fork(watchLastestDeleteStudyPlan),
  ]);
}

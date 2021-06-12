import { put, takeLatest, takeEvery, fork, all, call } from 'typed-redux-saga';
import { changeMemberPosition, getMyClassMembers } from './effects';
import { searchClassMembers, setClassAdvisors, setClassMembers, setLastChangedAt } from './slice';
import {
  changeMemberPositionSaga,
  fetchClassMembersSagaAction,
  searchStudentsSagaAction,
} from './saga-types';
import { setGlobalErrorAction } from '../global/saga-types';
import { MembershipPosition } from '../../../common/constants/user';
import { toggleProgressBarLoading } from '../global/slice';

export function* handleFetchClassMembers(action: any) {
  try {
    yield put({ type: toggleProgressBarLoading.type });

    const result = yield* call(getMyClassMembers, action.payload.classroomId);

    if (result) {
      const data: any[] = result.data.data;
      const advisors: any[] = [];
      const members = data.filter((val: any) => {
        const advisorMembership = val.memberships.find(
          (mb: any) =>
            mb.position === MembershipPosition.ADVISOR &&
            mb.classroomId === action.payload.classroomId
        );
        if (advisorMembership) {
          advisors.push(val);
          return false;
        }

        return true;
      });
      const setClassMembersDataAction = setClassMembers(members);
      const setClassAdvisorsDataAction = setClassAdvisors(advisors);
      yield put({
        type: setClassMembersDataAction.type,
        payload: setClassMembersDataAction.payload,
      });
      yield put({
        type: setClassAdvisorsDataAction.type,
        payload: setClassAdvisorsDataAction.payload,
      });
    }

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleFetchClassMembers] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleChangeMemberPosition(action: any) {
  try {
    console.log(
      '🔥🔥🔥  ▶️  file: sagas.ts  ▶️  line 53  ▶️  function*handleChangeMemberPosition  ▶️  action',
      action
    );
    yield put({ type: toggleProgressBarLoading.type });

    yield* call(
      changeMemberPosition,
      action.payload.classroomId,
      action.payload.userId,
      action.payload.newPosition
    );

    yield put({
      type: setLastChangedAt.type,
    });

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log(
      '🔥🔥🔥  ▶️  file: sagas.ts  ▶️  line 91  ▶️  function*handleChangeMemberPosition  ▶️  err',
      err
    );
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleSearchStudents(action: any) {
  yield put({ type: searchClassMembers.type, payload: action.payload });
}

export function* watchLastestFetchClassMembers() {
  yield takeLatest(fetchClassMembersSagaAction(null).type, handleFetchClassMembers);
}

export function* watchLastestChangeMemberPosition() {
  yield takeLatest(changeMemberPositionSaga(null).type, handleChangeMemberPosition);
}

export function* watchEverySearchStudents() {
  yield takeEvery(searchStudentsSagaAction(null).type, handleSearchStudents);
}

export default function* classMemberSaga() {
  yield all([
    fork(watchLastestFetchClassMembers),
    fork(watchLastestChangeMemberPosition),
    fork(watchEverySearchStudents),
  ]);
}

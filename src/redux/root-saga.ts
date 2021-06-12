import { fork, all } from 'redux-saga/effects';
import globalSaga from './state/global/sagas';
import userSaga from './state/user/sagas';
import classSaga from './state/class/sagas';
import classMemberSaga from './state/class-member/sagas';
import postSaga from './state/post/sagas';
import commentSaga from './state/comment/sagas';
import messageSaga from './state/message/sagas';
import studyPlanSaga from './state/study-plan/sagas';

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(globalSaga),
    fork(classSaga),
    fork(classMemberSaga),
    fork(messageSaga),
    fork(postSaga),
    fork(commentSaga),
    fork(studyPlanSaga),
  ]);
}

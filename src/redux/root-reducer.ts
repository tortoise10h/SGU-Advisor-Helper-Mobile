import userReducer from './state/user/slice';
import globalErrorReducer from './state/global/slice';
import classReducer from './state/class/slice';
import classMemberReducer from './state/class-member/slice';
import messageReducer from './state/message/slice';
import postReducer from './state/post/slice';
import commentReducer from './state/comment/slice';
import studyPlanReducer from './state/study-plan/slice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  user: userReducer,
  class: classReducer,
  classMember: classMemberReducer,
  message: messageReducer,
  global: globalErrorReducer,
  post: postReducer,
  comment: commentReducer,
  studyPlan: studyPlanReducer,
});

export default rootReducer;

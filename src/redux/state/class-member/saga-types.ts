import { createAction } from '@reduxjs/toolkit';

export const fetchClassMembersSagaAction = createAction<any | undefined>(
  '@@classMember/FETCH_CLASS_MEMBERS'
);
export const changeMemberPositionSaga = createAction<any | undefined>(
  '@@classMember/CHANGE_MEMBER_POSITION'
);
export const searchStudentsSagaAction = createAction<any | undefined>(
  '@@classMember/SEARCH_STUDENTS'
);

import { createAction } from '@reduxjs/toolkit';

export const createStudyPlanSagaAction = createAction<any | undefined>(
  '@@study-plan/CREATE_STUDY_PLAN'
);
export const fetchStudyPlansSagaAction = createAction<any | undefined>(
  '@@study-plan/FETCH_STUDY_PLANS'
);
export const fetchMoreStudyPlansAction = createAction<any | undefined>(
  '@@study-plan/FETCH_MORE_STUDY_PLANS'
);
export const deleteStudyPlanSagaAction = createAction<any | undefined>(
  '@@study-plan/DELETE_STUDY_PLAN'
);
export const updateStudyPlanSagaAction = createAction<any | undefined>(
  '@@study-plan/UPDATE_STUDY_PLAN'
);

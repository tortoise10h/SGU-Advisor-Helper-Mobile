import { createSlice } from '@reduxjs/toolkit';

export const StudyPlanSlice = createSlice({
  name: 'studyPlan',
  initialState: {
    studyPlans: [],
    lastChangedAt: null as any,
  },
  reducers: {
    setStudyPlans: (state, action) => {
      state.studyPlans = action.payload;
    },

    setStudyPlanLastChangedAt: state => {
      state.lastChangedAt = new Date();
    },
  },
});

export const { setStudyPlans, setStudyPlanLastChangedAt } = StudyPlanSlice.actions;

export const selectStudyPlans = (state: any) => state.studyPlan.studyPlans;
export const selectStudyPlanLastChangedAt = (state: any) => state.studyPlan.lastChangedAt;

export default StudyPlanSlice.reducer;

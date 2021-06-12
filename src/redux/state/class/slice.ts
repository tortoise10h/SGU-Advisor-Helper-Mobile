import { createSlice } from '@reduxjs/toolkit';

export const ClassSlice = createSlice({
  name: 'class',
  initialState: {
    myClasses: [],
    currentClass: {},
  },
  reducers: {
    setMyClassesData: (state, action) => {
      state.myClasses = action.payload;
    },

    setCurrentClassData: (state, action) => {
      console.log('[setCurrentClassData] action -> action: ', action);
      state.currentClass = action.payload;
    },
  },
});

export const { setMyClassesData, setCurrentClassData } = ClassSlice.actions;

export const selectMyClasses = (state: any) => state.class.myClasses;
export const selectCurrentClass = (state: any) => state.class.currentClass;

export default ClassSlice.reducer;

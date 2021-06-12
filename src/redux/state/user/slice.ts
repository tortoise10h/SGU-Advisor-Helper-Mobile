import { createSlice } from '@reduxjs/toolkit';

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    info: {},
    loginAt: null as any,
    infoInCurrentClass: {},
  },
  reducers: {
    setUserInfo: (state, action) => {
      console.log('[ setUserInfo ] -> action.payload: ', action.payload);
      state.info = action.payload;
    },
    setLoginAt: state => {
      state.loginAt = new Date();
    },
    setInfoInCurrentClass: (state, action) => {
      state.infoInCurrentClass = action.payload;
    },
  },
});

export const { setUserInfo, setLoginAt, setInfoInCurrentClass } = UserSlice.actions;

export const selectUser = (state: any) => state.user.info;
export const selectUserLoginAt = (state: any) => state.user.loginAt;
export const selectUserInfoInCurrentClass = (state: any) => state.user.infoInCurrentClass;
export const selectCurrentMemberShip = (state: any, classroomId: string) => {
  if (state.user.info && state.user.info.memberships) {
    const currentMembership = state.user.info.memberships.find(
      (membership: any) => membership.classroomId === classroomId
    );

    return currentMembership;
  }

  return null;
};

export default UserSlice.reducer;

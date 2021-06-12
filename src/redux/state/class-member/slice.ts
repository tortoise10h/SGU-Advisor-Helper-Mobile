import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const ClassMemberSlice = createSlice({
  name: 'classMember',
  initialState: {
    classMembers: [],
    classMembersSearch: [],
    classAdvisors: [],
    lastChangedAt: null as any,
  },
  reducers: {
    setClassMembers: (state, action) => {
      state.classMembers = action.payload;
      state.classMembersSearch = action.payload;
    },

    setClassAdvisors: (state, action) => {
      state.classAdvisors = action.payload;
    },

    setLastChangedAt: state => {
      state.lastChangedAt = new Date();
    },

    searchClassMembers: (state, action) => {
      let data = state.classMembers;

      if (!_.isEmpty(action.payload.search)) {
        data = data.filter((member: any) => {
          const search = action.payload.search.toLowerCase();
          let fullName = member.lastName + ' ' + member.firstName;
          fullName = fullName.toLowerCase();
          return fullName.includes(search) || member.sguId.includes(search);
        });
      }

      if (!_.isEmpty(action.payload.studyStateSearch)) {
        data = data.filter((member: any) => {
          return member.memberships.length && member.memberships[0].status === action.payload.studyStateSearch;
        });
      }

      state.classMembersSearch = data;
    },
  },
});

export const {
  setClassMembers,
  setLastChangedAt,
  setClassAdvisors,
  searchClassMembers,
} = ClassMemberSlice.actions;

export const selectClassMembers = (state: any) => state.classMember.classMembers;
export const selectClassMembersSearch = (state: any) => state.classMember.classMembersSearch;
export const selectClasssAdvisors = (state: any) => state.classMember.classAdvisors;
export const selectClassMemberLastChangedAt = (state: any) => state.classMember.lastChangedAt;

export default ClassMemberSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {DEFAULT_LIMIT, DEFAULT_PAGE} from '../../../config';

export const CommentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: [],
    commentPagin: {
      currentPage: DEFAULT_PAGE,
      count: 0,
      totalItems: 0,
      pageSize: DEFAULT_LIMIT,
      totalPages: 0,
    },
    lastChangedAt: null as any,
    fetchMoreAt: null as any,
  },
  reducers: {
    setComments: (state, action) => {
// const newCommentsData = state.comments.concat(action.payload);
      const newCommentsData = action.payload.concat(state.comments);
      state.comments = newCommentsData;
    },

    refreshComments: state => {
      state.comments = [];
    },

    setCommentPagin: (state, action) => {
      state.commentPagin = action.payload;
    },

    setCommentLastChangedAt: state => {
      state.lastChangedAt = new Date();
    },

    setFetchMoreAt: state => {
      state.fetchMoreAt = new Date();
    },
  },
});

export const {
  setComments,
  setCommentPagin,
  setCommentLastChangedAt,
  setFetchMoreAt,
  refreshComments,
} = CommentSlice.actions;

export const selectComments = (state: any) => state.comment.comments;
export const selectFetchMoreAt = (state: any) => state.comment.fetchMoreAt;
export const selectCommentPagin = (state: any) => state.comment.commentPagin;
export const selectCommentLastChangedAt = (state: any) => state.comment.lastChangedAt;

export default CommentSlice.reducer;

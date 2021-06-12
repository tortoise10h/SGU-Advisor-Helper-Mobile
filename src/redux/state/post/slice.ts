import { createSlice } from '@reduxjs/toolkit';

export const PostSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    postPagin: {},
    selectedPost: {},
    lastChangedAt: null as any,
    fetchMoreAt: null as any,
    refreshAt: null as any,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },

    setPostPagin: (state, action) => {
      state.postPagin = action.payload;
    },

    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },

    setPostLastChangedAt: state => {
      state.lastChangedAt = new Date();
    },

    setFetchMoreAt: state => {
      state.fetchMoreAt = new Date();
    },

    setRefreshAt: state => {
      state.fetchMoreAt = new Date();
    },

    setMorePosts: (state, action) => {
      const newPostsData = state.posts.concat(action.payload);
      state.posts = newPostsData;
    },
  },
});

export const {
  setPosts,
  setSelectedPost,
  setPostPagin,
  setPostLastChangedAt,
  setMorePosts,
  setFetchMoreAt,
  setRefreshAt,
} = PostSlice.actions;

export const selectPosts = (state: any) => state.post.posts;
export const selectPostPagin = (state: any) => state.post.postPagin;
export const selectSelectedPost = (state: any) => state.post.selectedPost;
export const selectPostLastChangedAt = (state: any) => state.post.lastChangedAt;
export const selectFetchMoreAt = (state: any) => state.post.fetchMoreAt;
export const selectRefreshAt = (state: any) => state.post.refreshAt;

export default PostSlice.reducer;

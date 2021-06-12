import { createSlice } from '@reduxjs/toolkit';

export const MessageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
    messagePagin: {},
    lastChangedAt: null as any,
    fetchMoreAt: null as any,
    sendedAt: null as any,
    unReadMessages: 0,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    setMessagePagin: (state, action) => {
      state.messagePagin = action.payload;
    },

    setMessageLastChangedAt: state => {
      state.lastChangedAt = new Date();
    },

    setMessageFetchMoreAt: state => {
      state.fetchMoreAt = new Date();
    },

    setMoreMessages: (state, action) => {
      const newMessagesData = state.messages.concat(action.payload);
      state.messages = newMessagesData;
    },

    setMoreOldMessages: (state, action) => {
      const newMessagesData = action.payload.concat(state.messages);
      state.messages = newMessagesData;
    },

    setSendedAt: state => {
      state.sendedAt = new Date();
    },

    setMoreUnReadMessages: (state, action) => {
      const newMessages = action.payload.newMessages || 0;
      state.unReadMessages += newMessages;
    },

    resetUnreadMessages: state => {
      state.unReadMessages = 0;
    },
  },
});

export const {
  setMessages,
  setMessagePagin,
  setMoreMessages,
  setMessageFetchMoreAt,
  setMessageLastChangedAt,
  setSendedAt,
  setMoreOldMessages,
  setMoreUnReadMessages,
  resetUnreadMessages,
} = MessageSlice.actions;

export const selectMessages = (state: any) => state.message.messages;
export const selectMessagePagin = (state: any) => state.message.messagePagin;
export const selectMessageLastChangedAt = (state: any) => state.message.lastChangedAt;
export const selectMessageFetchMoreAt = (state: any) => state.message.fetchMoreAt;
export const selectMessageSendedAt = (state: any) => state.message.sendedAt;
export const selectUnreadMessages = (state: any) => state.message.unReadMessages;

export default MessageSlice.reducer;

import { put, fork, all, call, takeLatest, takeEvery } from 'typed-redux-saga';
import { setMessagePagin, setMessages, setMoreMessages, setMoreOldMessages, setSendedAt } from './slice';
import {
  fetchMessagesSagaAction,
  fetchMoreMessagesSagaAction,
  sendMessageSagaAction,
  setMoreMessagesSagaAction,
} from './saga-types';
import { setGlobalErrorAction } from '../global/saga-types';
import { getMessages, sendMessages } from './effects';
import { toggleProgressBarLoading } from '../global/slice';
import {setFetchMoreAt} from '../post/slice';

export function* handleFetchMessages(action: any) {
  try {
    console.log('[handleFetchMessages] action: ', action);
    yield put({ type: toggleProgressBarLoading.type });

    const result = yield* call(
      getMessages,
      action.payload.conversationId,
      action.payload.content,
      action.payload.type
    );

    if (result) {
      let messagesData = result.data.data;
      messagesData = messagesData.reverse();

      const messagePagin = {
        count: result.data.count,
        currentPage: result.data.currentPage,
        totalItems: result.data.totalItems,
        pageSize: result.data.pageSize,
        totalPages: result.data.totalPages,
      };

      const setMessagesDataAction = setMessages(messagesData);
      const setMessagePaginAction = setMessagePagin(messagePagin);

      yield put({ type: setMessagesDataAction.type, payload: setMessagesDataAction.payload });
      yield put({ type: setMessagePaginAction.type, payload: setMessagePaginAction.payload });
    }

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleFetchMessages] err: ', err);
    yield put({ type: toggleProgressBarLoading.type });
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleSendMessage(action: any) {
  try {
    console.log('[handleSendMessage] action: ', action);
    const result = yield* call(sendMessages, action.payload.conversationId, [
      {
        content: action.payload.content,
        type: action.payload.type,
      },
    ]);

    if (result) {
      let messagesData = result.data;
      /** Because api create sendMessages does not return sender info so we need to do = 'cơm' */
      messagesData = messagesData.map((value: any) => {
        return {
          ...value,
          sender: action.payload.sender,
        };
      });

      const setMoreMesagesDataAction = setMoreMessages(messagesData);

      yield put({ type: setMoreMesagesDataAction.type, payload: setMoreMesagesDataAction.payload });
      yield put({ type: setSendedAt.type });
    }
  } catch (err) {
    console.log('[handleSendMessage] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* handleFetchMoreOldMessages(action: any) {
  try {
    yield put({ type: toggleProgressBarLoading.type });
    console.log('[handleFetchMoreMessages] action: ', action);
    const result = yield* call(getMessages, action.payload.conversationId, action.payload.page);

    if (result) {
      let messagesData = result.data.data;
      const messagePagin = {
        count: result.data.count,
        currentPage: result.data.currentPage,
        totalItems: result.data.totalItems,
        pageSize: result.data.pageSize,
        totalPages: result.data.totalPages,
      };
      messagesData = messagesData.reverse();

      const setMoreOldMessagesDataAction = setMoreOldMessages(messagesData);
      const setMessagePaginAction = setMessagePagin(messagePagin);

      yield put({ type: setMoreOldMessagesDataAction.type, payload: setMoreOldMessagesDataAction.payload });
      yield put({ type: setMessagePaginAction.type, payload: setMessagePaginAction.payload });
      yield put({ type: setFetchMoreAt.type });
    }

    yield put({ type: toggleProgressBarLoading.type });
  } catch (err) {
    console.log('[handleFetchMoreMessages] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
    yield put({ type: toggleProgressBarLoading.type });
  }
}

export function* handleSetMoreMessages(action: any) {
  try {
    console.log('[handleSetMoreMessages] action: ', action);
    if (action.payload.messages.length) {
      const setMoreMesagesDataAction = setMoreMessages(action.payload.messages);

      yield put({ type: setMoreMesagesDataAction.type, payload: setMoreMesagesDataAction.payload });
      yield put({ type: setSendedAt.type });
    }
  } catch (err) {
    console.log('[handleFetchMoreMessages] err: ', err);
    yield put({ type: setGlobalErrorAction.type });
  }
}

export function* watchLastestFetchMessages() {
  yield takeLatest(fetchMessagesSagaAction(null).type, handleFetchMessages);
}

export function* watchLastestSendMessage() {
  yield takeLatest(sendMessageSagaAction(null).type, handleSendMessage);
}

export function* watchLastestFetchMoreMessages() {
  yield takeLatest(fetchMoreMessagesSagaAction(null).type, handleFetchMoreOldMessages);
}

export function* watchEverySetMoreMessages() {
  yield takeEvery(setMoreMessagesSagaAction(null).type, handleSetMoreMessages);
}

export default function* messageSaga() {
  yield all([
    fork(watchLastestFetchMessages),
    fork(watchLastestSendMessage),
    fork(watchLastestFetchMoreMessages),
    fork(watchEverySetMoreMessages),
  ]);
}

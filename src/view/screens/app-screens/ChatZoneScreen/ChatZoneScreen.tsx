import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import styles from './styles';
import AppBarWithDrawerToggle from '../../../components/common/AppBarWithDrawerToggle/AppBarWithDrawerToggle';
import { selectCurrentClass } from '../../../../redux/state/class/slice';
import MessageSent from './components/MessageSent';
import MessageReceived from './components/MessageReceived';
import ChatBox from './components/ChatBox';
import {
  selectMessageLastChangedAt,
  selectMessagePagin,
  selectMessages,
  selectMessageSendedAt,
} from '../../../../redux/state/message/slice';
import {
  fetchMessagesSagaAction,
  fetchMoreMessagesSagaAction,
  sendMessageSagaAction,
} from '../../../../redux/state/message/saga-types';
import { selectCurrentMemberShip, selectUser } from '../../../../redux/state/user/slice';
import { IMessageData } from './interfaces';

const ChatZoneScreen = ({ navigation }: { navigation: any }) => {
  const scrollViewRef = useRef(null as any);

  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);

  const currentClass = useSelector(selectCurrentClass);
  const currentMembership = useSelector((state: any) =>
    selectCurrentMemberShip(state, currentClass.id)
  );
  const userInfo = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const messageLastChangedAt = useSelector(selectMessageLastChangedAt);
  const messagePagin = useSelector(selectMessagePagin);
  const messageSendedAt = useSelector(selectMessageSendedAt);

  console.log('[ChatZoneScreen] currentClass: ', currentClass);
  console.log('[ChatZoneScreen] currentClass.conversation: ', currentClass.conversation);

  useEffect(() => {
    dispatch({
      type: fetchMessagesSagaAction.type,
      payload: {
        conversationId: currentClass.conversation.id,
      },
    });
    setTimeout(() => {
      scrollViewRef?.current.scrollToEnd();
    }, 500);
  }, [currentClass, messageLastChangedAt]);

  useEffect(() => {
    setLoadingMore(false);
  }, [messages]);

  useEffect(() => {
    scrollViewRef?.current.scrollToEnd();
  }, [messageSendedAt]);

  const handleSendMessage = (content: string, type?: string) => {
    dispatch({
      type: sendMessageSagaAction.type,
      payload: {
        classroomId: currentClass.id,
        conversationId: currentClass.conversation.id,
        content,
        type,
        sender: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          id: userInfo.id,
          sguId: userInfo.sguId,
          email: userInfo.email,
          gender: userInfo.gender,
          positionInClassroom: currentMembership && currentMembership.position,
          role: userInfo.role,
        },
      },
    });
  };

  const isCloseToTop = ({ contentOffset }: { contentOffset: any }) => {
    if (contentOffset.y === 0) {
      if (messagePagin.currentPage < messagePagin.totalPages) {
        scrollViewRef?.current.scrollTo({ y: contentOffset.y + 10 });
      }
      return true;
    }

    return false;
  };

  const fetchMoreMessages = () => {
    console.log('[ChatZoneScreen] messagePagin: ', messagePagin);
    if (messagePagin.currentPage < messagePagin.totalPages && !loadingMore) {
      setLoadingMore(true);
      const nextPage = messagePagin.currentPage + 1;
      dispatch({
        type: fetchMoreMessagesSagaAction.type,
        payload: { conversationId: currentClass.conversation.id, page: nextPage },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBarWithDrawerToggle
        titleCustomStyle={{ fontSize: 22 }}
        navigation={navigation}
        title={`Lớp ${currentClass.code}`}
      />
      <ScrollView
        ref={scrollViewRef}
        style={{ marginVertical: 10 }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToTop(nativeEvent)) {
            fetchMoreMessages();
          }
        }}>
        {messages.length
          ? messages.map((message: IMessageData, index: number) =>
              userInfo.id === message.sender.id ? (
                <MessageSent key={index} message={message} />
              ) : (
                <MessageReceived key={index} message={message} />
              )
            )
          : null}
      </ScrollView>
      <ChatBox sendMessage={handleSendMessage} />
    </SafeAreaView>
  );
};

export default ChatZoneScreen;

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Menu, Dialog, Portal, Button } from 'react-native-paper';
import moment from 'moment';
import firebaseAuth from '@react-native-firebase/auth';

import { appColor } from '../../../../styles/color';
import styles from './styles';
import ClassMemberRoleBadge from '../../../../components/common/UserInClassBadge/ClassMemberRoleBadge';
import { IFeedData } from '../ListFeedScreen/interfaces';
import FileItem from './components/FileItem';
import CommentBox from './components/CommentBox';
import {
  selectCommentLastChangedAt,
  selectCommentPagin,
  selectComments,
  selectFetchMoreAt,
} from '../../../../../redux/state/comment/slice';
import { IPostComment } from './interfaces';
import CommentItem from './components/CommentItem';
import { fetchCommentsSagaAction } from '../../../../../redux/state/comment/saga-types';
import ScreenName from '../../../../../common/constants/screen-name';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../../redux/state/global/saga-types';
import { deletePost } from '../../../../../redux/state/post/effects';
import { selectCurrentClass } from '../../../../../redux/state/class/slice';
import { setPostLastChangedAt } from '../../../../../redux/state/post/slice';
import { deleteSingleFileOnFirebasePromise } from '../../../../../common/utils/file-upload';
import {selectCurrentMemberShip, selectUser} from '../../../../../redux/state/user/slice';
import {MembershipPosition} from '../../../../../common/constants/user';

const FeedDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null as any);

  const [commentLoading, setCommentLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] = useState(false);

  const feed: IFeedData = JSON.parse(route.params.feed);
  const user = useSelector(selectUser);
  const currentClass = useSelector(selectCurrentClass);
  const currentMembership = useSelector((state: any) => selectCurrentMemberShip(state, currentClass.id));
  console.log(
    '🔥🔥🔥  ▶️  file: FeedDetailScreen.tsx  ▶️  line 42  ▶️  FeedDetailScreen  ▶️  currentClass',
    currentClass
  );
  const comments: IPostComment[] = useSelector(selectComments);
  const commentPagin = useSelector(selectCommentPagin);
  const commentFetchMoreAt = useSelector(selectFetchMoreAt);
  const commentLastChangedAt = useSelector(selectCommentLastChangedAt);

  console.log('[FeedDetailScreen] feed: ', feed);
  const {
    title,
    content,
    id,
    author,
    attachments,
    createdAt,
  }: {
    title: string;
    content: string;
    id: string;
    author: any;
    createdAt: Date;
    attachments: any[];
  } = feed as IFeedData;

  const authenAnonymousFrb = useCallback(() => {
    dispatch({ type: toggleLoadingAction.type });
    firebaseAuth()
      .signInAnonymously()
      .then(() => {
        dispatch({ type: toggleLoadingAction.type });
      })
      .catch(error => {
        dispatch({ type: toggleLoadingAction.type });
        if (error.code === 'auth/operation-not-allowed') {
          dispatch({
            type: setGlobalErrorAction.type,
            payload: {
              error:
                'Ứng dụng của bạn hiện chưa được cấp quyền để truy cập kho dữ liệu, xin liên hệ ngay với đội ngũ IT để được cấp quyền',
            },
          });
        }

        console.error(error);
      });
  }, []);

  const scrollDownToBottom = () => {
    scrollViewRef?.current.scrollToEnd();
  };

  useEffect(() => {
    authenAnonymousFrb();
  }, []);

  useEffect(() => {
    dispatch({ type: fetchCommentsSagaAction.type, payload: { postId: id, page: 1 } });
  }, []);

  useEffect(() => {
    dispatch({ type: fetchCommentsSagaAction.type, payload: { postId: id, page: 1 } });
    scrollDownToBottom();
  }, [id, commentLastChangedAt]);

  useEffect(() => {
    setCommentLoading(false);
  }, [commentFetchMoreAt]);

  const backToListFeeed = () => {
    navigation.navigate(ScreenName.LIST_FEED_SCREEN);
  };

  const loadMoreComments = () => {
    if (commentPagin.currentPage < commentPagin.totalPages && !commentLoading) {
      const nextPage = commentPagin.currentPage + 1;
      setCommentLoading(true);
      dispatch({ type: fetchCommentsSagaAction.type, payload: { postId: id, page: nextPage } });
    }
  };

  const onCloseMenu = () => {
    setMenuVisible(false);
  };

  const onOpenMenu = () => {
    setMenuVisible(true);
  };

  const openDeleteDialog = () => {
    setConfirmDeleteDialogVisible(true);
  };

  const closeDeleteDialog = () => {
    setConfirmDeleteDialogVisible(false);
  };

  const handleDeleteFeed = async () => {
    try {
      closeDeleteDialog();

      dispatch({ type: toggleLoadingAction.type });
      await deletePost(currentClass.id, feed.id);

      /** Delete this post files too */
      if (feed.attachments.length) {
        const deleteFilePromises: any = [];
        feed.attachments.forEach((file: any) => {
          deleteFilePromises.push(deleteSingleFileOnFirebasePromise(file.fileName));
        });
        Promise.all(deleteFilePromises);
      }

      dispatch({ type: setPostLastChangedAt.type });
      dispatch({ type: toggleLoadingAction.type });

      navigation.navigate(ScreenName.LIST_FEED_SCREEN);
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });
      dispatch({ type: setPostLastChangedAt.type });
      navigation.navigate(ScreenName.LIST_FEED_SCREEN);
      console.log('[FeedDetailScreen] deletePost: ', err);
      dispatch({
        type: setGlobalErrorAction.type,
        payload: { error: 'Có lỗi xảy ra hãy thử lại sau' },
      });
    }
  };

  const onPressMenuItemDeleteFeed = () => {
    onCloseMenu();
    openDeleteDialog();
  };

  const onPressEditFeed = () => {
    onCloseMenu();
    navigation.navigate(ScreenName.EDIT_FEED_SCREEN, {
      feed: JSON.stringify(feed),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Confirm delete feed dialog */}
      <Portal>
        <Dialog visible={confirmDeleteDialogVisible} onDismiss={closeDeleteDialog}>
          <Dialog.Title>Bạn có chắc là muốn xóa bài viết này hay không?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={closeDeleteDialog}>Không</Button>
            <Button onPress={handleDeleteFeed}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView ref={scrollViewRef}>
        {/* Start header */}
        <View style={styles.headerNavigationContainer}>
          <View style={{ flex: 5, flexDirection: 'row' }}>
            <View style={{ flex: 2, justifyContent: 'flex-start' }}>
              <TouchableOpacity onPress={backToListFeeed}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color={appColor.hardPrimaryColor}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 8 }}></View>
          </View>
          <View style={{ flex: 5, alignItems: 'flex-end' }}>
            {(currentMembership && currentMembership.position === MembershipPosition.ADVISOR) ||
            (currentMembership &&
              currentMembership.position === MembershipPosition.MONITOR &&
              feed.author.id === user.id) ? (
              <Menu
                visible={menuVisible}
                onDismiss={onCloseMenu}
                anchor={
                  <MaterialCommunityIcons name="dots-horizontal" size={20} onPress={onOpenMenu} />
                }>
                <Menu.Item onPress={onPressMenuItemDeleteFeed} title="Xóa bài viết" />
                <Menu.Item onPress={onPressEditFeed} title="Chỉnh sửa bài viết" />
              </Menu>
            ) : null}
          </View>
        </View>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <Text style={styles.headerCreatedAt}>
            Đăng vào ngày: {moment(createdAt).format('DD/MM/YYYY h:mm a')}
          </Text>
          <View style={styles.headerAuthorContainer}>
            <View style={styles.headerAuthorAvatar}>
              <Avatar
                size="small"
                avatarStyle={{ backgroundColor: '#eaeaea' }}
                rounded
                icon={{ name: 'user', type: 'font-awesome', color: '#fff' }}
              />
            </View>
            <View style={styles.headerAuthorName}>
              <Text>
                {author.lastName} {author.firstName}
              </Text>
            </View>
            <View style={styles.headerAuthorPositionContainer}>
              <ClassMemberRoleBadge
                badgeStyle={{
                  padding: 5,
                }}
                value={feed.author.positionInClassroom}
              />
            </View>
          </View>
          <Divider />
          {/* Start content */}
          <HTML
            containerStyle={{ marginVertical: 20 }}
            tagsStyles={{ p: { color: 'black', lineHeight: 20 } }}
            baseFontStyle={{ lineHeight: 20 }}
            source={{ html: content }}
          />
          {attachments.length
            ? attachments.map((file: any, index: number) => <FileItem file={file} key={index} />)
            : null}
          <Divider />
          {/* Start button info */}
          <View style={styles.metadataContainer}>
            <View style={styles.postMetadataContainer}>
              <MaterialCommunityIcons
                name="comment-outline"
                color={appColor.textBlackColor}
                size={15}
                style={{ flex: 1 }}
              />
              <Text style={styles.postMetadataText}>{commentPagin.totalItems} bình luận</Text>
              <MaterialCommunityIcons
                name="attachment"
                color={appColor.textBlackColor}
                size={15}
                style={{ flex: 1 }}
              />
              <Text style={styles.postMetadataText}>{attachments.length}</Text>
            </View>
            <View style={{ flex: 3, flexDirection: 'row' }}></View>
          </View>
        </View>
        {commentPagin.currentPage < commentPagin.totalPages ? (
          <View style={styles.loadMoreCommentsContainer}>
            {commentLoading ? (
              <ActivityIndicator animating={true} color={appColor.primaryColor} />
            ) : (
              <Text
                onPress={loadMoreComments}
                style={{
                  color: appColor.textBlackColor,
                }}>
                Tải thêm bình luận cũ hơn
              </Text>
            )}
          </View>
        ) : null}
        {/* Start comment zone */}
        <View>
          {comments.length
            ? comments.map((comment: IPostComment, index: number) => (
                <CommentItem key={index} comment={comment} />
              ))
            : null}
        </View>
      </ScrollView>
      {/* Start comment input box */}
      <CommentBox postId={id} />
    </SafeAreaView>
  );
};

export default FeedDetailScreen;

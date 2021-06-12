import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { IPostComment } from '../interfaces';
import moment from 'moment';
import { TIME_DISPLAY_FORMAT } from '../../../../../../common/constants/common';
import { selectUser } from '../../../../../../redux/state/user/slice';
import { deleteCommentSagaAction } from '../../../../../../redux/state/comment/saga-types';

const CommentItem = ({ comment }: { comment: IPostComment }) => {
  const dispatch = useDispatch();

  const userInfo = useSelector(selectUser);
  const popupMenuRef = useRef(null as any);
  const authorNameFirstLetter = comment.author.firstName.substring(0, 1);

  const onLongPressComment = () => {
    if (comment.author.id === userInfo.id) {
      popupMenuRef?.current.open();
    }
  };

  const handleDeleteComment = () => {
    dispatch({
      type: deleteCommentSagaAction.type,
      payload: { commentId: comment.id, postId: comment.postId },
    });
  };

  return (
    <TouchableNativeFeedback onLongPress={onLongPressComment}>
      <ListItem>
        <Avatar
          containerStyle={{ alignSelf: 'flex-start' }}
          size="small"
          avatarStyle={{ backgroundColor: '#eaeaea' }}
          rounded
          title={authorNameFirstLetter}
          onPress={() => console.log('Works!')}
        />
        <ListItem.Content style={{ flex: 9 }}>
          <View style={{ flexDirection: 'row' }}>
            <ListItem.Title>
              {comment.author.lastName} {comment.author.firstName}{' '}
            </ListItem.Title>

            <Menu ref={popupMenuRef}>
              <MenuTrigger text="" />
              <MenuOptions>
                <MenuOption onSelect={handleDeleteComment}>
                  <Text style={{ color: 'red' }}>Xóa bình luận</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <ListItem.Subtitle style={{ fontSize: 10 }}>
            {moment(comment.createdAt).format(TIME_DISPLAY_FORMAT)}
          </ListItem.Subtitle>
          <Text style={{ marginTop: 10 }} textBreakStrategy="balanced">
            {comment.content}
          </Text>
        </ListItem.Content>
      </ListItem>
    </TouchableNativeFeedback>
  );
};

export default CommentItem;

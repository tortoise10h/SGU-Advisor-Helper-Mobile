import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, TextInput } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import { createComment } from '../../../../../../redux/state/comment/effects';
import { setCommentLastChangedAt } from '../../../../../../redux/state/comment/slice';
import { ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CommentBox = ({ postId }: { postId: string }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const submitComment = async () => {
    if (!_.isEmpty(content)) {
      setLoading(true);
      setContent('');
      await createComment(postId, { content });
      dispatch({ type: setCommentLastChangedAt.type });
      setLoading(false);
    }
  };

  return (
    <View>
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 8 }}>
          <KeyboardAwareScrollView>
            <TextInput
              onChangeText={(text: string) => setContent(text)}
              multiline={true}
              style={{ paddingHorizontal: 10 }}
              placeholder="Bình luận..."
              value={content}
            />
          </KeyboardAwareScrollView>
        </View>
        <View style={{ flex: 2 }}>
          {loading ? (
            <ActivityIndicator animating={true} color="black" />
          ) : (
            <Button
              onPress={submitComment}
              buttonStyle={{ backgroundColor: 'transparent' }}
              icon={<MaterialCommunityIcons name="send" size={20} />}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentBox;

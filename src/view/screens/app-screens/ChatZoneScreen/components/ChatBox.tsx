import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Divider, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {appColor} from '../../../../styles/color';


const ChatBox = ({ sendMessage }: { sendMessage: any }) => {
  const [content, setContent] = useState('');
  console.log('[ChatBox] handleSendMessage: ', sendMessage);

  const onPressSendMessage = () => {
    if (!_.isEmpty(content)) {
      setContent('');
      sendMessage(content);
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
              placeholder="Nhập tin nhắn..."
              value={content}
            />
          </KeyboardAwareScrollView>
        </View>
        <View style={{ flex: 2 }}>
          <Button
            onPress={onPressSendMessage}
            buttonStyle={{ backgroundColor: 'transparent' }}
            disabledStyle={{ backgroundColor: 'transparent' }}
            disabled={_.isEmpty(content)}
            icon={
              <MaterialCommunityIcons
                color={_.isEmpty(content) ? 'black' : appColor.hardPrimaryColor}
                name="send"
                size={20}
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

export default ChatBox;

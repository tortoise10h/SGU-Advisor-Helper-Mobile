import React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { WINDOW_WIDTH } from '../../../../../config';
import { appColor } from '../../../../styles/color';
import { IMessageData } from '../interfaces';

const MessageSent = ({ message }: { message: IMessageData }) => {

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: (WINDOW_WIDTH * 3) / 100,
        marginVertical: 5,
      }}>
      <View style={{ flex: 3 }}></View>
      <View style={{ flex: 7, flexDirection: 'row', justifyContent: 'flex-end' }}>
        {message.isSending ? <ActivityIndicator color="red" /> : null}
        <View>
          <Text
            style={{
              textAlign: 'right',
              fontSize: 11,
              paddingHorizontal: 5,
              paddingVertical: 3,
              color: appColor.textBlackColor,
            }}>
            Bạn
          </Text>
          <View>
            <Text
              style={{
                padding: 10,
                backgroundColor: appColor.primaryColor,
                borderRadius: 8,
                color: '#fff',
                alignSelf: 'baseline',
              }}>
              {message.content}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageSent;

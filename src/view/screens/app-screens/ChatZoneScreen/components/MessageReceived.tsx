import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { MembershipPosition } from '../../../../../common/constants/user';
import { WINDOW_WIDTH } from '../../../../../config';
import ClassMemberRoleBadge from '../../../../components/common/UserInClassBadge/ClassMemberRoleBadge';
import { appColor } from '../../../../styles/color';
import { IMessageData } from '../interfaces';

const MessageReceived = ({ message }: { message: IMessageData }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: (WINDOW_WIDTH * 3) / 100,
        marginVertical: 5,
      }}>
      <View style={{ flex: 8, flexDirection: 'row' }}>
        <View style={{ marginRight: 5 }}>
          <Avatar
            rounded
            title={message.sender.firstName.slice(0, 1)}
            avatarStyle={{ backgroundColor: '#c9ccd1' }}
            size={35}
          />
        </View>
        <View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 11,
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  color: appColor.textBlackColor,
                }}>
                {message.sender.lastName} {message.sender.firstName}
              </Text>
              {message.sender.positionInClassroom &&
              message.sender.positionInClassroom !== MembershipPosition.STUDENT ? (
                <ClassMemberRoleBadge
                  badgeStyle={{ padding: 2 }}
                  value={message.sender.positionInClassroom}
                />
              ) : null}
            </View>
            <View>
              <Text
                style={{
                  padding: 10,
                  backgroundColor: '#f7f7f8',
                  borderRadius: 8,
                  alignSelf: 'baseline',
                }}>
                {message.content}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 2 }}></View>
    </View>
  );
};

export default MessageReceived;

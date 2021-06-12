import React from 'react';
import { View, Text } from 'react-native';
import { appColor } from '../../../../styles/color';
import { Divider } from 'react-native-elements';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';
import {ILessonData, LessonStatus} from '../interfaces';

const LessonItem = ({ lesson }: { lesson: ILessonData }) => {
  const renderLessonStateIcon = () => {
    switch (lesson.status) {
      case LessonStatus.Failed: {
        return (<AntDesignIcon name="close" size={20} color="red" />);
      }
      case LessonStatus.Passed: {
        return (<AntDesignIcon name="check" size={20} color="green" />);
      }
      case LessonStatus.Studying: {
        return (<FontAwesome name="pencil" size={20} color={appColor.primaryColor} />);
      }
      default: return null;
    }
  };

  return (
    <>
      <View
        style={{
          alignSelf: 'stretch',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 5,
          marginVertical: 10,
        }}>
        <View style={{ flex: 2, ...styles.tableItem }}>
          <Text style={{ color: appColor.textBlackColor }}>{lesson.code}</Text>
        </View>
        <View style={{ flex: 4, ...styles.tableItem }}>
          <Text style={{ color: appColor.textBlackColor }}>{lesson.name}</Text>
        </View>
        <View style={{ flex: 2, ...styles.tableItem }}>
          <Text style={{ color: appColor.textBlackColor, textAlign: 'center' }}>{lesson.creditCount}</Text>
        </View>
        <View style={{ flex: 2, ...styles.tableItem, paddingHorizontal: 2 }}>
          <Text style={{ color: appColor.textBlackColor, textAlign: 'center' }}>
            {renderLessonStateIcon()}
          </Text>
        </View>
      </View>
      <Divider />
    </>
  );
};

export default LessonItem;

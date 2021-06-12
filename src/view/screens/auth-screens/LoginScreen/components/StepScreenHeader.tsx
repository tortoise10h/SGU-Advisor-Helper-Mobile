import React from 'react';
import { View, Text } from 'react-native';

const StepScreenHeader = ({
  title,
  description,
  contentContainerStyle,
  titleStyle,
  descriptionStyle,
  leftIcon,
}: {
  title: string;
  description: string;
  contentContainerStyle?: any;
  titleStyle?: any;
  descriptionStyle?: any;
  leftIcon?: React.ReactNode;
}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        ...contentContainerStyle,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          textAlign: 'center',
          color: '#2c2e47',
          ...titleStyle,
        }}>
        {leftIcon}
        {'  '}
        {title}
      </Text>
      <Text
        style={{
          color: '#4c596f',
          paddingVertical: 10,
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 28,
          ...descriptionStyle,
        }}>
        {description}
      </Text>
    </View>
  );
};;

export default StepScreenHeader;

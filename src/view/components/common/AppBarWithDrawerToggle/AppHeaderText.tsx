import React from 'react';
import { Text } from 'react-native';

const AppHeaderText = ({ text, customStyle }: { text: string; customStyle?: any }) => {
  return <Text style={{ fontSize: 25, ...customStyle }}>{text}</Text>;
};;

export default AppHeaderText;

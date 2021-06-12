import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const StepScreenButton = ({
  btnText,
  btnStyle,
  btnTextStyle,
  onPress,
  btnRightIcon,
}: {
  btnText: string;
  btnMode?: string;
  btnStyle?: any;
  btnTextStyle?: any;
  onPress?: any;
  btnRightIcon?: React.ReactNode;
}) => {
  return (
    <>
      <Button
        style={btnStyle}
        uppercase={true}
        mode="contained"
        onPress={onPress}>
        <Text style={btnTextStyle}>{btnText}</Text>
        <View style={{ width: 25, height: 1 }} />
        {btnRightIcon}
      </Button>
    </>
  );
};

export default StepScreenButton;

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { WINDOW_WIDTH } from '../../../../../config/index';

const InputWithLabel = ({
  labelText,
  labelStyle,
  inputContainerStyle,
  inputStyle, placeholderText,
  onChangeText,
  onBlur,
  value,
  errorMessageStyle,
  errorMessageText,
}: {
  labelText: string,
  labelStyle?: any;
  inputContainerStyle?: any;
  inputStyle?: any;
  placeholderText?: string;
  onChangeText?: any;
  onBlur?: any;
  value?: any;
  errorMessageStyle?: any;
  errorMessageText?: string;
}) => {
  return (
    <View>
      <Text
        style={{
          marginBottom: 15,
          fontSize: 15,
          fontWeight: '700',
          color: '#4c596f',
          paddingLeft: 5,
          ...labelStyle,
        }}>
        {labelText}
      </Text>
      <View
        style={{
          ...inputContainerStyle,
        }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 18,
            elevation: 4,
            ...inputStyle,
          }}
          placeholder={placeholderText}
          autoCapitalize="none"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
        />
      </View>
      <Text
        style={{
          marginTop: 10,
          paddingLeft: 5,
          marginHorizontal: (WINDOW_WIDTH * 5) / 100,
          color: 'red',
          ...errorMessageStyle,
        }}>
        {errorMessageText}
      </Text>
    </View>
  );
};

export default InputWithLabel;

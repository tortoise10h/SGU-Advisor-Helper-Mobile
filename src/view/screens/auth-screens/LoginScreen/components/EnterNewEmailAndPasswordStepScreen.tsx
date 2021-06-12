import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import { Formik } from 'formik';

import StepScreenHeader from './StepScreenHeader';
import styles from '../style';
import { WINDOW_WIDTH } from '../../../../../config';
import StepScreenButton from './StepScreenBtn';

const NewAccountInfoSchema = yup.object({
  password: yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu không được để trống'),
  email: yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
});

const EnterNewEmailAndPasswordStepScreen = ({
  data,
  onPressBackBtn,
  onSubmit,
  sguPassword,
}: {
  data: any;
  onPressBackBtn: any;
  onSubmit: any;
  sguPassword: string | undefined;
}) => {
  const [isSecureText, setIsSecureText] = useState(true);

  return (
    <View style={styles.stepScreenContainer}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StepScreenHeader
          titleStyle={{ fontSize: 28 }}
          title={data.item.title}
          description={data.item.description}
          leftIcon={<Feather onPress={onPressBackBtn} name="arrow-left" size={25} color="blue" />}
        />
      </View>
      <Formik
        initialValues={{ email: '', password: sguPassword || '' }}
        validationSchema={NewAccountInfoSchema}
        onSubmit={values => {
          onSubmit(values.email, values.password);
        }}>
        {formikProps => (
          <View style={{ flex: 9 }}>
            <View style={{ flex: 8, justifyContent: 'center' }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.inputLabel}>Email</Text>
                <View>
                  <View style={styles.inputBlock}>
                    <TextInput
                      style={styles.textInputWithIcon}
                      placeholder="Email của bạn..."
                      autoCapitalize="none"
                      value={formikProps.values.email}
                      onChangeText={formikProps.handleChange('email')}
                      onBlur={formikProps.handleBlur('email')}
                    />
                    <Feather
                      name="check-circle"
                      size={20}
                      color={formikProps.errors.email ? 'red' : '#4c596f'}
                    />
                  </View>
                  <View>
                    <Text style={{ ...styles.textInputErrorText }}>{formikProps.errors.email}</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.inputLabel}>Mật khẩu</Text>
                <View>
                  <View style={styles.inputBlock}>
                    <TextInput
                      style={styles.textInputWithIcon}
                      secureTextEntry={isSecureText}
                      placeholder="Mật khẩu của bạn..."
                      onChangeText={formikProps.handleChange('password')}
                      autoCapitalize="none"
                      value={formikProps.values.password}
                      onBlur={formikProps.handleBlur('password')}
                    />
                    <Feather
                      name={isSecureText ? 'eye' : 'eye-off'}
                      onPress={() => setIsSecureText(!isSecureText)}
                      size={20}
                      color={formikProps.errors.password ? 'red' : '#4c596f'}
                    />
                  </View>
                </View>
                <View>
                  <Text style={{ ...styles.textInputErrorText }}>{formikProps.errors.password}</Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 2 }}>
              <StepScreenButton
                btnStyle={{
                  ...styles.loginBtn,
                  marginHorizontal: (WINDOW_WIDTH * 5) / 100,
                }}
                btnTextStyle={styles.loginBtnText}
                btnText="Hoàn tất"
                btnRightIcon={<Feather name="arrow-right" size={20} color="#fff" />}
                onPress={formikProps.handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default EnterNewEmailAndPasswordStepScreen;

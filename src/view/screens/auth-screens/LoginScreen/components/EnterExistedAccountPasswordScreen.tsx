import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import { Formik } from 'formik';

import StepScreenHeader from './StepScreenHeader';
import styles from '../style';
import StepScreenButton from './StepScreenBtn';

const ExistedAccountPasswordSchema = yup.object({
  password: yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu không được để trống'),
});

const EnterExistedAccountPasswordScreen = ({
  data,
  onSubmit,
  onPressBackBtn,
}: {
  data: any;
  onSubmit: any;
  onPressBackBtn: any;
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
        initialValues={{ password: '' }}
        validationSchema={ExistedAccountPasswordSchema}
        onSubmit={values => {
          onSubmit(values.password);
        }}>
        {formikProps => (
          <View style={{ flex: 9 }}>
            <View style={{ flex: 6, justifyContent: 'center' }}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View>
                <View style={styles.inputBlock}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    secureTextEntry={isSecureText}
                    placeholder="Mật khẩu của bạn..."
                    autoCapitalize="none"
                    value={formikProps.values.password}
                    onChangeText={formikProps.handleChange('password')}
                    onBlur={formikProps.handleBlur('password')}
                  />
                  <Feather
                    onPress={() => setIsSecureText(!isSecureText)}
                    name={isSecureText ? 'eye' : 'eye-off'}
                    color={formikProps.errors.password ? 'red' : '#4c596f'}
                    size={20}
                  />
                </View>
                <View>
                  <Text style={{ ...styles.textInputErrorText }}>
                    {formikProps.errors.password}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 4, justifyContent: 'center' }}>
              <StepScreenButton
                btnStyle={styles.loginBtn}
                btnTextStyle={styles.loginBtnText}
                btnText="Đăng nhập"
                onPress={formikProps.handleSubmit}
                btnRightIcon={<Feather name="arrow-right" size={20} color="#fff" />}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default EnterExistedAccountPasswordScreen;

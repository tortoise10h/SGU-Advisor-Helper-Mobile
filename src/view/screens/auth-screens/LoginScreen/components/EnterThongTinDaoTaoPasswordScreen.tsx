import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import StepScreenHeader from './StepScreenHeader';
import Feather from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import { Formik } from 'formik';

import styles from '../style';
import StepScreenButton from './StepScreenBtn';

const ThongTinDaoTaoPasswordSchema = yup.object({
  password: yup.string().required('Mật khẩu không được để trống'),
});

const EnterThongTinDaoTaoPasswordScreen = ({
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
    <View
      style={styles.stepScreenContainer}>
      <View style={{ flex: 3, alignItems: 'center' }}>
        <StepScreenHeader
          titleStyle={{ fontSize: 28 }}
          title={data.item.title}
          description={data.item.description}
          leftIcon={<Feather onPress={onPressBackBtn} name="arrow-left" size={25} color="blue" />}
        />
      </View>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={ThongTinDaoTaoPasswordSchema}
        onSubmit={values => {
          onSubmit(values.password);
        }}>
        {formikProps => (
          <View style={{ flex: 7 }}>
            <View style={{ flex: 5, justifyContent: 'center' }}>
              <Text
                style={styles.inputLabel}>
                Mật khẩu
              </Text>
              <View>
                <View style={styles.inputBlock}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    onChangeText={formikProps.handleChange('password')}
                    value={formikProps.values.password}
                    onBlur={formikProps.handleBlur('password')}
                    secureTextEntry={isSecureText}
                    placeholder="Mật khẩu trang thontindaotao.sgu.edu.vn..."
                    autoCapitalize="none"
                  />
                  <Feather
                    onPress={() => setIsSecureText(!isSecureText)}
                    name={isSecureText ? 'eye' : 'eye-off'}
                    size={20}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={styles.textInputErrorText}>
                  {formikProps.errors.password}
                </Text>
              </View>
            </View>
            <View style={{ flex: 5, justifyContent: 'center' }}>
              <StepScreenButton
                btnStyle={styles.loginBtn}
                btnTextStyle={styles.loginBtnText}
                btnText="Tiếp tục"
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

export default EnterThongTinDaoTaoPasswordScreen;

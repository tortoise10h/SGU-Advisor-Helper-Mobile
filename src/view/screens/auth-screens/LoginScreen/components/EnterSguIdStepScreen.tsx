import React from 'react';
import { View } from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import StepScreenHeader from './StepScreenHeader';
import InputWithLabel from './InputWithLabel';
import styles from '../style';
import { WINDOW_WIDTH } from '../../../../../config';
import StepScreenButton from './StepScreenBtn';
import Feather from 'react-native-vector-icons/Feather';

const SGUIdSchema = yup.object({
  sguId: yup.string().required('MSSV/MGV không được để trống'),
});

const EnterSguIdStepScreen = ({
  data,
  handleSubmitScreenEnterSGUId,
}: {
  data: any;
  handleSubmitScreenEnterSGUId: any;
}) => {
  return (
    <View
      style={styles.stepScreenContainer}>
      <View style={{ flex: 2 }}>
        <StepScreenHeader title={data.item.title} description={data.item.description} />
      </View>
      <Formik
        initialValues={{ sguId: '' }}
        validationSchema={SGUIdSchema}
        onSubmit={values => {
          handleSubmitScreenEnterSGUId(values);
        }}>
        {formikProps => (
          <View style={{ flex: 8 }}>
            <View style={{ flex: 6, justifyContent: 'center' }}>
              <InputWithLabel
                labelText="MSSV/MGV"
                labelStyle={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100 }}
                inputContainerStyle={styles.inputBlock}
                inputStyle={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100 }}
                placeholderText="Nhập vào mã của bạn..."
                onChangeText={formikProps.handleChange('sguId')}
                value={formikProps.values.sguId}
                onBlur={formikProps.handleBlur('sguId')}
                errorMessageText={formikProps.errors.sguId}
              />
            </View>
            <View style={{ flex: 4, justifyContent: 'center' }}>
              <StepScreenButton
                btnStyle={styles.loginBtn}
                btnTextStyle={styles.loginBtnText}
                onPress={formikProps.handleSubmit}
                btnText="Tiếp tục"
                btnRightIcon={<Feather name="arrow-right" size={20} color="#fff" />}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default EnterSguIdStepScreen;

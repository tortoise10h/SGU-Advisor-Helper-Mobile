import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from 'react-native-elements';
import { Button as PaperButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as yup from 'yup';
import { Formik } from 'formik';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import ScreenName from '../../../../../common/constants/screen-name';
import styles from './styles';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../../redux/state/global/saga-types';
import { selectCurrentClass } from '../../../../../redux/state/class/slice';
import { WINDOW_WIDTH } from '../../../../../config';
import { appColor } from '../../../../styles/color';
import { setStudyPlanLastChangedAt } from '../../../../../redux/state/study-plan/slice';
import { createStudyPlan } from '../../../../../redux/state/study-plan/effects';

const NewStudyPlanSchema = yup.object({
  title: yup.string().required('Tiêu đề không được để trống'),
  description: yup.string().optional(),
});

const CreateStudyPlanScreen = ({ navigation }: { navigation: any }) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [studyPlanDate, setStudyPlanDate] = useState(null as any);
  const [studyPlanDateStr, setStuyPlanDateStr] = useState('Chọn ngày');

  const currentClass = useSelector(selectCurrentClass);

  const dispatch = useDispatch();

  const onClose = () => {
    navigation.navigate(ScreenName.LIST_STUDY_PLAN_SCREEN);
  };

  const handleSubmitCreateStudyPlan = async (values: any) => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      if (!moment(studyPlanDate).isValid()) {
        dispatch({ type: toggleLoadingAction.type });
        Alert.alert('Xin hãy chọn ngày cho kế hoạch học tập này!');
        return;
      }
      console.log('[handleSubmitCreateStudyPlan] values: ', values);

      await createStudyPlan(currentClass.id, {
        title: values.title,
        description: values.description,
        time: studyPlanDate,
      });

      dispatch({ type: toggleLoadingAction.type });
      /** For making list study plan reload */
      dispatch({ type: setStudyPlanLastChangedAt.type });

      navigation.navigate(ScreenName.LIST_STUDY_PLAN_SCREEN);
    } catch (err) {
      console.log('[handleSubmitCreateStudyPlan] err: ', err);
      dispatch({ type: toggleLoadingAction.type });
      dispatch({
        type: setGlobalErrorAction.type,
        payload: { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      });
    }
  };

  const closeDatePickerModal = () => {
    setIsDatePickerVisible(false);
  };

  const openDatePickerModal = () => {
    setIsDatePickerVisible(true);
  };

  const handleDatePickerConfirm = (date: Date) => {
    setStudyPlanDate(moment(date).startOf('day'));
    setStuyPlanDateStr(moment(date).startOf('day').format('DD/MM/YYYY'));
    closeDatePickerModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={NewStudyPlanSchema}
        onSubmit={values => {
          handleSubmitCreateStudyPlan(values);
        }}>
        {formikProps => (
          <>
            <KeyboardAwareScrollView style={{ flexGrow: 1 }}>
              <ScrollView>
                <View style={styles.createPostContainer}>
                  <Text style={styles.createPostTitle}>Tạo kế hoạch học tập</Text>
                  <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <AntDesignIcon name="close" size={25} />
                  </TouchableOpacity>
                </View>
                <View>
                  <View style={styles.createPostFormContainer}>
                    <Input
                      label={
                        <Text
                          style={{
                            color: appColor.textLightBlackColor,
                            fontSize: 16,
                            fontWeight: '700',
                          }}>
                          Tiêu đề <MaterialCommunityIcons name="asterisk" color="red" />
                        </Text>
                      }
                      inputContainerStyle={styles.createPostFormInput}
                      onChangeText={formikProps.handleChange('title')}
                      value={formikProps.values.title}
                      multiline={true}
                      onBlur={formikProps.handleBlur('title')}
                      errorMessage={formikProps.errors.title}
                      placeholder="Nhập vào tiêu đề..."
                    />
                    <Input
                      label={
                        <Text
                          style={{
                            color: appColor.textLightBlackColor,
                            fontSize: 16,
                            fontWeight: '700',
                          }}>
                          Mô tả
                        </Text>
                      }
                      inputContainerStyle={styles.createPostFormInput}
                      placeholder="Nhập vào mô tả..."
                      numberOfLines={7}
                      multiline={true}
                      textAlignVertical="top"
                      onChangeText={formikProps.handleChange('description')}
                      value={formikProps.values.description}
                      onBlur={formikProps.handleBlur('description')}
                      errorMessage={formikProps.errors.description}
                    />
                  </View>
                </View>
                <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100, paddingHorizontal: 5 }}>
                  <PaperButton
                    icon={() => (
                      <AntDesignIcon name="calendar" size={18} color={appColor.primaryColor} />
                    )}
                    style={{ borderColor: appColor.primaryColor }}
                    onPress={openDatePickerModal}
                    mode="outlined">
                    {studyPlanDateStr}
                  </PaperButton>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDatePickerConfirm}
                    onCancel={closeDatePickerModal}
                  />
                </View>
              </ScrollView>
            </KeyboardAwareScrollView>
            <View style={styles.submitPostContainer}>
              <Button
                buttonStyle={styles.submitPostBtn}
                titleStyle={styles.submitPostBtnTitle}
                iconRight={true}
                icon={
                  <AntDesignIcon
                    name="checkcircle"
                    style={{ marginLeft: 10 }}
                    size={20}
                    color="#fff"
                  />
                }
                title="Tạo kế hoạch học tập"
                onPress={() => formikProps.handleSubmit()}
              />
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateStudyPlanScreen;

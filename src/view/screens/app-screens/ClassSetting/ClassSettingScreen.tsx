import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from 'react-native-elements';
import ScreenName from '../../../../common/constants/screen-name';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import * as yup from 'yup';
import { Formik } from 'formik';
import { appColor } from '../../../styles/color';
import { selectCurrentClass, setCurrentClassData } from '../../../../redux/state/class/slice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WINDOW_WIDTH} from '../../../../config';
import {setGlobalErrorAction, toggleLoadingAction} from '../../../../redux/state/global/saga-types';
import {updateClassSetting} from '../../../../redux/state/class/effects';

const ClassSettingSchema = yup.object({
  lowScore: yup
    .number()
    .typeError('Mức điểm báo động phải là số')
    .required('Cài đặt mức điểm báo động không được để trống'),
});

const ClassSettingScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const currentClass = useSelector(selectCurrentClass);
  console.log('[ClassSettingScreen] currentClass: ', currentClass);
  const classLowScore = parseFloat(currentClass.settings.lowScore);

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  const handleUpdateClassSettings = async (values: any) => {
    values = {
      ...values,
      lowScore: parseFloat(values.lowScore),
    };

    console.log('[handleUpdateClassSettings] values: ', values);
    try {
      dispatch({ type: toggleLoadingAction.type });
      await updateClassSetting(currentClass.id, values);
      const newCurrentClassInfo = {
        ...currentClass,
        settings: {
          ...values,
        },
      };
      dispatch({ type: setCurrentClassData.type, payload: newCurrentClassInfo });
      dispatch({ type: toggleLoadingAction.type });
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });
      dispatch({ type: setGlobalErrorAction.type, payload: { error: 'Có lỗi xảy ra, vui lòng thử lại sau' } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View>
        <TouchableOpacity onPress={navigateToClassMemberScreen}>
          <AntDesignIcon
            style={{ marginLeft: 5 }}
            name="arrowleft"
            size={25}
            color={appColor.hardPrimaryColor}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: appColor.textBlackColor,
            fontSize: 30,
          }}>
          Cài đặt lớp
        </Text>
      </View>
      <View style={{ marginTop: 20, marginHorizontal: (WINDOW_WIDTH * 5) / 100 }}>
        <Formik
          initialValues={{ lowScore: classLowScore }}
          validationSchema={ClassSettingSchema}
          onSubmit={values => {
            handleUpdateClassSettings(values);
          }}>
          {formikProps => (
            <>
              <KeyboardAwareScrollView style={{ flexGrow: 1 }}>
                <View>
                  <Input
                    label={
                      <Text
                        style={{
                          color: appColor.textLightBlackColor,
                          fontSize: 16,
                          fontWeight: '700',
                        }}>
                        Mức điểm báo động <MaterialCommunityIcons name="asterisk" color="red" />
                      </Text>
                    }
                    onChangeText={formikProps.handleChange('lowScore')}
                    value={formikProps.values.lowScore.toString()}
                    onBlur={formikProps.handleBlur('lowScore')}
                    errorMessage={formikProps.errors.lowScore}
                    placeholder="Nhập vào mức điểm báo động..."
                  />
                </View>
              </KeyboardAwareScrollView>
              <View>
                <Button
                  buttonStyle={{ backgroundColor: appColor.primaryColor }}
                  iconRight={true}
                  icon={
                    <AntDesignIcon
                      name="checkcircle"
                      style={{ marginLeft: 10 }}
                      size={20}
                      color="#fff"
                    />
                  }
                  title="Lưu chỉnh sửa"
                  onPress={() => formikProps.handleSubmit()}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ClassSettingScreen;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { IStepScreenData, IUserInfo, IAccountRegistration } from './interfaces';
import { getInfoBySGUId, verifyThongTinDaoTaoPassword } from '../../../../redux/state/user/effects';
import { toggleLoadingAction } from '../../../../redux/state/global/saga-types';
import EnterSguIdStepScreen from './components/EnterSguIdStepScreen';
import ShowNewAccountInfoStepScreen from './components/ShowNewAccountInfoStepScreen';
import EnterThongTinDaoTaoPasswordScreen from './components/EnterThongTinDaoTaoPasswordScreen';
import EnterNewEmailAndPasswordStepScreen from './components/EnterNewEmailAndPasswordStepScreen';
import { regiserAction, loginAction } from '../../../../redux/state/user/saga-types';
import EnterExistedAccountPasswordScreen from './components/EnterExistedAccountPasswordScreen';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [sliderRef, setSliderRef] = useState({
    goToSlide: (index: number) => console.log('Go to slide ', index),
  });
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    sguPassword: '',
    lastName: '',
    gender: '',
    role: '',
    sguId: '',
    major: {
      faculty: {
        id: '',
        name: '',
      },
      facultyId: '',
      id: '',
      name: '',
    },
    claims: {
      schoolYearStart: '',
      schoolYearEnd: '',
    },
    memberships: [
      {
        classroom: {
          code: '',
          id: '',
          majorId: '',
          name: '',
          schoolYearStart: '',
          schoolYearEnd: '',
          settings: {},
        },
        classroomId: '',
        isAdviser: false,
      },
    ],
  } as IUserInfo);
  const [movedScreensTracked, setMovedScreensTracked] = useState([{ current: 0, previous: 0 }]);

  const stepScreens: IStepScreenData[] = [
    {
      key: 'enterStudentIdScreen',
      title: 'Nh???p v??o m?? s??? c???a b???n',
      description:
        '????? ????ng nh???p v??o ???ng d???ng b???n c???n nh???p m??o MSSV/MGV c???a m??nh ??ang ???????c s??? d???ng t???i trang web thongtindaotao.sgu.edu.vn',
    },
    {
      key: 'newAccountInfoScreen',
      title: 'Xin ch??o',
      description: '',
    },
    {
      key: 'enterThongTinDaoTaoPasswordScreen',
      title: 'T??? ?????ng ?????ng b??? th??ng tin t??? thongtindaotao.sgu.edu.vn',
      description:
        'C?? v??? ????y l?? l???n ?????u b???n truy c???p v??o ???ng d???ng, ????? ?????m b???o ????y ch??nh l?? b???n xin vui l??ng x??c nh???n b???ng c??ch nh???p m???t kh???u c???a trang thongtindaotao.sgu.edu.vn v??o b??n d?????i',
    },
    {
      key: 'enterNewEmailAndPasswordScreen',
      title: 'Ho??n t???t vi???c ????ng k?? t??i kho???n',
      description:
        '???? ho??n t???t vi???c x??c nh???n, h??y ho??n th??nh c??c th??ng tin cu???i c??ng b??n d?????i cho t??i kho???n m???i c???a b???n nh??',
    },
    {
      key: 'enterExistedAccountPassword',
      title: 'Nh???p v??o m???t kh???u c???a b???n',
      description: '',
    },
  ];

  const handleSubmitScreenEnterSGUId = async (values: any) => {
    try {
      console.log('[handleSubmitScreenEnterSGUId] values: ', values);
      dispatch(toggleLoadingAction(null));
      const result = await getInfoBySGUId(values.sguId);
      console.log('[handleSubmitScreenEnterSGUId] result: ', result);

      if (result) {
        console.log('[handleSubmitScreenEnterSGUId] result.data: ', result.data);
        const userInfoBySGUId = result.data;
        /** User is not exist if field "id" is not existed */
        const nextScreen = userInfoBySGUId.id
          ? {
              current: 4,
              previous: 0,
            }
          : {
              current: 1,
              previous: 0,
            };
        setMovedScreensTracked(movedScreensTracked.concat(nextScreen));
        setUserInfo({ ...userInfoBySGUId });
        sliderRef.goToSlide(nextScreen.current);
      }

      dispatch(toggleLoadingAction(null));
    } catch (err) {
      dispatch(toggleLoadingAction(null));
    }
  };

  const handleShowAccountInfoNextBtn = () => {
    const nextScreen = {
      current: 2,
      previous: 1,
    };
    setMovedScreensTracked(movedScreensTracked.concat(nextScreen));
    sliderRef.goToSlide(nextScreen.current);
  };

  const handleSubmitThongTinDaoTaoPassword = async (password: string) => {
    dispatch(toggleLoadingAction(null));
    const result = await verifyThongTinDaoTaoPassword(userInfo.sguId, password);

    if (result) {
      setMovedScreensTracked(
        movedScreensTracked.concat({
          current: 3,
          previous: 2,
        })
      );
      setUserInfo({ ...userInfo, sguPassword: password });
      sliderRef.goToSlide(3);
    }

    dispatch(toggleLoadingAction(null));
  };

  const handleStepScreenBackBtn = () => {
    const currentScreen = movedScreensTracked.pop() || { current: 0, previous: 0 };
    console.log('[handleStepScreenBackBtn] currentScreen: ', currentScreen);
    setMovedScreensTracked(movedScreensTracked);
    sliderRef.goToSlide(currentScreen.previous);
  };

  const handleSubmitRegisterAccount = async (email: string, password: string) => {
    const registerInfo = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email,
      password,
      gender: userInfo.gender,
      studentId: userInfo.sguId,
      classroomId: userInfo.memberships[0].classroomId,
    } as IAccountRegistration;

    dispatch(regiserAction(registerInfo));
  };

  const handleSubmitLogin = (password: string) => {
    const payload = {
      loginInfo: {
        sguId: userInfo.sguId,
        password,
      },
      userInfo,
    };

    dispatch(loginAction(payload));
  };

  const renderStepScreen = (data: any) => {
    switch (data.item.key) {
      case 'enterStudentIdScreen': {
        /** SCREEN 0 */
        return (
          <EnterSguIdStepScreen
            data={data}
            handleSubmitScreenEnterSGUId={handleSubmitScreenEnterSGUId}
          />
        );
      }
      case 'newAccountInfoScreen': {
        /** SCREEN 1 */
        return (
          <ShowNewAccountInfoStepScreen
            data={data}
            userInfo={userInfo}
            onPressBackBtn={handleStepScreenBackBtn}
            onPressNextBtn={handleShowAccountInfoNextBtn}
          />
        );
      }
      case 'enterThongTinDaoTaoPasswordScreen': {
        /** SCREEN 2 */
        return (
          <EnterThongTinDaoTaoPasswordScreen
            onSubmit={handleSubmitThongTinDaoTaoPassword}
            data={data}
            onPressBackBtn={handleStepScreenBackBtn}
          />
        );
      }
      case 'enterNewEmailAndPasswordScreen': {
        /** SCREEN 3 */
        return (
          <EnterNewEmailAndPasswordStepScreen
            sguPassword={userInfo.sguPassword}
            data={data}
            onSubmit={handleSubmitRegisterAccount}
            onPressBackBtn={handleStepScreenBackBtn}
          />
        );
      }
      case 'enterExistedAccountPassword': {
        /** SCREEN 4 */
        return (
          <EnterExistedAccountPasswordScreen
            onPressBackBtn={handleStepScreenBackBtn}
            data={data}
            onSubmit={handleSubmitLogin}
          />
        );
      }

      default: {
        return (
          <View>
            <Text style={{ fontWeight: 'bold' }}>{data.item.title}</Text>
            <Text>{data.item.description}</Text>
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <AppIntroSlider
            dotStyle={{ backgroundColor: 'transparent' }}
            data={stepScreens}
            activeDotStyle={{ backgroundColor: 'transparent' }}
            showNextButton={false}
            showDoneButton={false}
            showPrevButton={false}
            scrollEnabled={false}
            renderItem={renderStepScreen}
            ref={(re: any) => setSliderRef(re!)}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

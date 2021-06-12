import React from 'react';
import { View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { convertUserGender } from '../../../../../common/constants/user';

import { IUserInfo, IMemberShip } from '../interfaces';
import StepScreenButton from './StepScreenBtn';
import StepScreenHeader from './StepScreenHeader';
import StudentInfoListItem from './StudentInfoListItem';
import styles from '../style';

const ShowNewAccountInfoStepScreen = ({
  data,
  userInfo,
  onPressNextBtn,
  onPressBackBtn,
}: {
  data: any;
  userInfo: IUserInfo;
  onPressNextBtn: any;
  onPressBackBtn: any;
}) => {
  return (
    <View
      style={{
        ...styles.stepScreenContainer,
        flex: 2,
      }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StepScreenHeader
          titleStyle={{ fontSize: 28 }}
          title={`${data.item.title} ${userInfo.lastName} ${userInfo.firstName}`}
          description={data.item.description}
          leftIcon={<Feather onPress={onPressBackBtn} name="arrow-left" size={25} color="blue" />}
        />
      </View>
      <View style={{ flex: 6, justifyContent: 'center' }}>
        <View style={styles.newAccountInfoContainer}>
          <StudentInfoListItem
            title="Họ và tên:"
            content={`${userInfo.lastName} ${userInfo.firstName}`}
          />
          <StudentInfoListItem title="Giới tính:" content={convertUserGender(userInfo.gender)} />
          <StudentInfoListItem
            title="Niên khóa:"
            content={`${userInfo.claims.schoolYearStart} - ${userInfo.claims.schoolYearEnd}`}
          />
          {
            userInfo.memberships.length
              ? userInfo.memberships.map((membership: IMemberShip, index: number) => (
                <StudentInfoListItem key={index} title="Lớp" content={membership.classroom.code} />
              ))
              : null
          }
          <StudentInfoListItem title="Khoa" content={userInfo.major.faculty.name} />
          <StudentInfoListItem title="Ngành" content={userInfo.major.name} />
        </View>
      </View>
      <View style={{ flex: 3, justifyContent: 'center' }}>
        <StepScreenButton
          btnStyle={styles.showAccountInfoNextBtn}
          btnTextStyle={styles.loginBtnText}
          onPress={onPressNextBtn}
          btnText="Tiếp tục"
          btnRightIcon={<Feather name="arrow-right" size={20} color="#fff" />}
        />
      </View>
    </View>
  );
};

export default ShowNewAccountInfoStepScreen;

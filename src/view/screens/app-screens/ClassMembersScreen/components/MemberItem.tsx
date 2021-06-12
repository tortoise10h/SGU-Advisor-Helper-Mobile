import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ListItem, Avatar } from 'react-native-elements';
import { View } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Button, Dialog, Portal } from 'react-native-paper';

import styles from '../styles';
import { IClassMemberData } from '../interfaces';
import {
  ClassCorePositions,
  convertClassMembershipPosition,
  MembershipPosition,
  StudentStudyState,
} from '../../../../../common/constants/user';
import ClassMemberRoleBadge from '../../../../components/common/UserInClassBadge/ClassMemberRoleBadge';
import { changeMemberPositionSaga } from '../../../../../redux/state/class-member/saga-types';
import ScreenName from '../../../../../common/constants/screen-name';
import { IUserInfo } from '../../../auth-screens/LoginScreen/interfaces';
import MemberStudyState from './MemberStudyState';

const MemberItem = ({
  navigation,
  member,
  classroomId,
  currentMembership,
  user,
}: {
  navigation: any;
  member: IClassMemberData;
  classroomId: string;
  currentMembership: any;
  user: IUserInfo;
}) => {
  const dispatch = useDispatch();

  const changeRoleMenuRef = useRef(null as any);
  const mainMenuRef = useRef(null as any);

  const [newPosition, setNewPosition] = useState('');
  const [changePositionDialogConfirm, setChangePositionDialogConfirm] = useState(false);

  const onSelectChangePosition = async () => {
    await mainMenuRef?.current.close();
    await changeRoleMenuRef?.current.open();
  };

  const closeConfirmChangePoistionDialog = () => {
    setChangePositionDialogConfirm(false);
  };

  const openConfirmChangePoistionDialog = () => {
    setChangePositionDialogConfirm(true);
  };

  const onSelectChoosePosition = async (position: MembershipPosition) => {
    if (position !== member.memberships[0].position) {
      await changeRoleMenuRef?.current.close();
      setNewPosition(position);
      console.log(
        '🔥🔥🔥  ▶️  file: MemberItem.tsx  ▶️  line 36  ▶️  onSelectChoosePosition  ▶️  position',
        position
      );
      openConfirmChangePoistionDialog();
    }
  };

  const handleChangeMemberPosition = () => {
    dispatch({
      type: changeMemberPositionSaga.type,
      payload: {
        classroomId,
        userId: member.id,
        newPosition,
      },
    });
    closeConfirmChangePoistionDialog();
  };

  const navigateToStudentScoreScreen = () => {
    const memberData = JSON.stringify(member);
    navigation.navigate(ScreenName.STUDENT_SCORE_SCREEN, {
      member: memberData,
    });
  };

  const navigateToStudentTimeTableScreen = () => {
    const memberData = JSON.stringify(member);
    navigation.navigate(ScreenName.STUDENT_TIME_TABLE_SCREEN, {
      member: memberData,
    });
  };

  const navigateToStudentLessonPathScreen = () => {
    const memberData = JSON.stringify(member);
    navigation.navigate(ScreenName.STUDENT_LESSON_PATH_SCREEN, {
      member: memberData,
    });
  };

  const navigateToStudentProfileScreen = () => {
    const memberData = JSON.stringify(member);
    navigation.navigate(ScreenName.STUDENT_PROFILE_SCREEN, {
      member: memberData,
    });
  };

  return (
    <>
      <View>
        <ListItem
          containerStyle={styles.listUserItemContainerStyle}
          style={styles.listUserItemStyle}>
          <Avatar
            size={30}
            avatarStyle={styles.listUserAvatar}
            title={member.firstName.slice(0, 1)}
          />
          <ListItem.Content>
            <ListItem.Title>
              {member.lastName} {member.firstName}
            </ListItem.Title>
            <ListItem.Subtitle>{member.sguId}</ListItem.Subtitle>
            {member.memberships &&
            member.memberships.length &&
            member.memberships[0].status !== StudentStudyState.ACTIVE ? (
              <MemberStudyState studyState={member.memberships[0].status} />
            ) : null}
          </ListItem.Content>
          {member.memberships[0].position !== MembershipPosition.STUDENT ? (
            <ClassMemberRoleBadge
              badgeStyle={{ padding: 5 }}
              value={member.memberships[0].position}
            />
          ) : null}
          {currentMembership &&
          (ClassCorePositions.includes(currentMembership.position) || member.id === user.id) ? (
            <Menu ref={mainMenuRef}>
              <MenuTrigger>
                <MaterialCommunityIcons name="dots-horizontal" size={20} />
              </MenuTrigger>
              <MenuOptions>
                {/* Thong Tin Sinh Vien - Avisor, Monitor */}
                {currentMembership && ClassCorePositions.includes(currentMembership.position) ? (
                  <MenuOption
                    onSelect={navigateToStudentProfileScreen}
                    text="Thông tin sinh viên"
                  />
                ) : null}
                {/* Doi Chuc Vu - Avisor */}
                {currentMembership && currentMembership.position === MembershipPosition.ADVISOR ? (
                  <MenuOption onSelect={onSelectChangePosition} text="Đổi chức vụ" />
                ) : null}
                {/* Xem Diem - Avisor, Monitor, Student himself/herself */}
                {currentMembership &&
                (ClassCorePositions.includes(currentMembership.position) ||
                  member.id === user.id) ? (
                  <MenuOption onSelect={navigateToStudentScoreScreen} text="Xem điểm" />
                ) : null}
                {/* Xem TKB - Avisor, Monitor, Student himself/herself */}
                {currentMembership &&
                (ClassCorePositions.includes(currentMembership.position) ||
                  member.id === user.id) ? (
                  <MenuOption onSelect={navigateToStudentTimeTableScreen} text="Xem TKB" />
                ) : null}
                {/* Xem Lo Trinh Hoc - Avisor, Student himself/herself */}
                {currentMembership &&
                (currentMembership.position === MembershipPosition.ADVISOR ||
                  member.id === user.id) ? (
                  <MenuOption
                    onSelect={navigateToStudentLessonPathScreen}
                    text="Xem lộ trình môn học"
                  />
                ) : null}
              </MenuOptions>
            </Menu>
          ) : null}
          <Menu ref={changeRoleMenuRef}>
            <MenuTrigger text="" />
            <MenuOptions>
              <MenuOption
                onSelect={() => onSelectChoosePosition(MembershipPosition.MONITOR)}
                text="Lớp trưởng"
              />
              <MenuOption
                onSelect={() => onSelectChoosePosition(MembershipPosition.VICE_MONITOR)}
                text="Lớp phó"
              />
              <MenuOption
                onSelect={() => onSelectChoosePosition(MembershipPosition.SECRETARY)}
                text="Bí Thư"
              />
              <MenuOption
                onSelect={() => onSelectChoosePosition(MembershipPosition.STUDENT)}
                text="Sinh viên"
              />
            </MenuOptions>
          </Menu>
        </ListItem>
      </View>

      <Portal>
        <Dialog visible={changePositionDialogConfirm} onDismiss={closeConfirmChangePoistionDialog}>
          <Dialog.Title>
            Bạn có đồng ý thay đổi chức vụ của sinh viên &quot;{member.lastName} {member.firstName}
            &quot; thành &quot;{convertClassMembershipPosition(newPosition)}&quot; hay không?
          </Dialog.Title>
          <Dialog.Actions>
            <Button onPress={closeConfirmChangePoistionDialog}>Không</Button>
            <Button onPress={handleChangeMemberPosition}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default MemberItem;

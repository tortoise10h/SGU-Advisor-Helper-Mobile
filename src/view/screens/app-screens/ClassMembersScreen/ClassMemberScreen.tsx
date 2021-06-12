import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ListItem, Avatar } from 'react-native-elements';
import { Searchbar, Button } from 'react-native-paper';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import AppBarWithDrawerToggle from '../../../components/common/AppBarWithDrawerToggle/AppBarWithDrawerToggle';
import styles from './styles';
import { selectCurrentClass } from '../../../../redux/state/class/slice';
import { selectCurrentMemberShip, selectUser } from '../../../../redux/state/user/slice';
import {
  searchClassMembers,
  selectClassMemberLastChangedAt,
  selectClassMembersSearch,
  selectClasssAdvisors,
} from '../../../../redux/state/class-member/slice';
import {
  fetchClassMembersSagaAction,
} from '../../../../redux/state/class-member/saga-types';
import { IClassMemberData } from './interfaces';
import { convertStudentStudyState, MembershipPosition, StudentStudyState } from '../../../../common/constants/user';
import ClassMemberRoleBadge from '../../../components/common/UserInClassBadge/ClassMemberRoleBadge';
import MemberItem from './components/MemberItem';
import ScreenName from '../../../../common/constants/screen-name';
import {WINDOW_WIDTH} from '../../../../config';
import {appColor} from '../../../styles/color';

const ClassMembersScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [studyStateSearch, setStudyStateSearch] = useState(null as any);

  const userInfo = useSelector(selectUser);
  const currentClass = useSelector(selectCurrentClass);
  const currentMembership = useSelector((state: any) =>
    selectCurrentMemberShip(state, currentClass.id)
  );
  const classMembersSearch = useSelector(selectClassMembersSearch);
  const classAdvisors = useSelector(selectClasssAdvisors);
  const classMemberLastChangedAt = useSelector(selectClassMemberLastChangedAt);

  const navigateToStatisticFailedStudentBySemesterScreen = () => {
    navigation.navigate(ScreenName.STATISTIC_FAILED_STUDENTS_BY_SEMESTER_SCREEN);
  };

  const navigateToStatisticWeakStudentBySemesterScreen = () => {
    navigation.navigate(ScreenName.STATISTIC_WEAK_STUDENTS_BY_SEMESTER_SCREEN);
  };

  const navigateToStatisticDebtStudentsBySemesterScreen = () => {
    navigation.navigate(ScreenName.STATISTIC_DEBT_STUDENTS_BY_SEMESTER);
  };

  const navigateToClassSettingScren = () => {
    navigation.navigate(ScreenName.CLASS_SETTING_SCREEN);
  };

  const onChangeSearch = (text: string) => {
    setSearch(text);
  };

  const onSelectStudyStateFilter = (value: any) => {
    setStudyStateSearch(value);
  };

  useEffect(() => {
    dispatch({ type: searchClassMembers.type, payload: { search, studyStateSearch } });
  }, [search, studyStateSearch]);

  useEffect(() => {
    dispatch({ type: fetchClassMembersSagaAction.type, payload: { classroomId: currentClass.id } });
  }, [classMemberLastChangedAt, currentClass]);

  return (
    <SafeAreaView style={styles.container}>
      {/* === Top bar === */}
      <AppBarWithDrawerToggle
        titleCustomStyle={{ fontSize: 22 }}
        navigation={navigation}
        title={`Lớp ${currentClass.code}`}
        bonusActionComponent={
          currentMembership && currentMembership.position === MembershipPosition.ADVISOR ? (
            <Menu>
              <MenuTrigger>
                <Ionicons style={{ marginRight: 5 }} name="caret-down-circle-outline" size={30} />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  onSelect={navigateToStatisticFailedStudentBySemesterScreen}
                  text="Thống kê danh sách sinh viên rớt môn theo học kỳ"
                />
                <MenuOption
                  onSelect={navigateToStatisticDebtStudentsBySemesterScreen}
                  text="Thống kê danh sách sinh viên chưa đóng học phí"
                />
                <MenuOption
                  onSelect={navigateToStatisticWeakStudentBySemesterScreen}
                  text="Thống kê danh sách sinh viên có điểm báo động"
                />
                <MenuOption
                  onSelect={navigateToClassSettingScren}
                  text="Cài đặt lớp"
                />
              </MenuOptions>
            </Menu>
          ) : null
        }
      />

      {/* === List members in class === */}
      <Searchbar
        value={search}
        onChangeText={(text: string) => onChangeSearch(text)}
        style={styles.searchBar}
        placeholder="Tìm sinh viên..."
      />
      <ScrollView>
        <View style={{ marginBottom: 20 }}>
          <View>
            <Text style={styles.listUserTitle}>
              <FontAwesome5 color="#333" size={25} name="user-shield" />
              {'  '}Cố vấn học tập
            </Text>
          </View>

          {classAdvisors.map((member: IClassMemberData, i: number) => (
            <ListItem
              key={i}
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
              </ListItem.Content>
              {member.memberships[0].position !== MembershipPosition.STUDENT ? (
                <ClassMemberRoleBadge value={member.memberships[0].position} />
              ) : null}
            </ListItem>
          ))}
        </View>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text style={styles.listUserTitle}>
                <FontAwesome5 color="#333" size={25} name="users" />
                {'  '}Sinh viên
              </Text>
            </View>
            <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100 }}>
              <Menu>
                <MenuTrigger>
                  <Button mode="outlined" style={{ borderColor: appColor.primaryColor }}>
                    {studyStateSearch !== null
                      ? convertStudentStudyState(studyStateSearch)
                      : 'Tất cả'}
                  </Button>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => onSelectStudyStateFilter(null)} text="Tất cả" />
                  <MenuOption
                    onSelect={() => onSelectStudyStateFilter(StudentStudyState.ACTIVE)}
                    text={convertStudentStudyState(StudentStudyState.ACTIVE)}
                  />
                  <MenuOption
                    onSelect={() => onSelectStudyStateFilter(StudentStudyState.DROPPED_OUT)}
                    text={convertStudentStudyState(StudentStudyState.DROPPED_OUT)}
                  />
                  <MenuOption
                    onSelect={() => onSelectStudyStateFilter(StudentStudyState.COMPLETED)}
                    text={convertStudentStudyState(StudentStudyState.COMPLETED)}
                  />
                </MenuOptions>
              </Menu>
            </View>
          </View>
          {classMembersSearch.map((member: IClassMemberData, i: number) => (
            <MemberItem
              navigation={navigation}
              key={i}
              member={member}
              user={userInfo}
              classroomId={currentClass.id}
              currentMembership={currentMembership}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClassMembersScreen;

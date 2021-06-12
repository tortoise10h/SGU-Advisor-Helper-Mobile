import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import { commonScreenOptions } from '../configs';

import ScreenName from '../../common/constants/screen-name';
import ListFeedScreen from '../../view/screens/app-screens/FeedScreen/ListFeedScreen/ListFeedScreen';
import CreateFeedScreen from '../../view/screens/app-screens/FeedScreen/CreateFeedScreen/CreateFeedScreen';
import FeedDetailScreen from '../../view/screens/app-screens/FeedScreen/FeedDetailScreen/FeedDetailScreen';
import ListStudyPlanScreen from '../../view/screens/app-screens/StudyPlanScreens/ListStudyPlanScreen/ListStudyPlanScreen';
import CreateStudyPlanScreen from '../../view/screens/app-screens/StudyPlanScreens/CreateStudyPlanScreen/CreateStudyPlanScreen';
import EditStudyPlanScreen from '../../view/screens/app-screens/StudyPlanScreens/EditStudyPlanScreen/EditStudyPlanScreen';
import ClassMembersScreen from '../../view/screens/app-screens/ClassMembersScreen/ClassMemberScreen';
import StudentScoreScreen from '../../view/screens/app-screens/StudentScroreScreen/StudentScoreScreen';
import StudentTimeTableScren from '../../view/screens/app-screens/StudentTimeTableScreen/StudentTimeTableScreen';
import StudentLessonPathScreen from '../../view/screens/app-screens/StudentLessonPathScreen/StudentLessonPathScreen';
import StatisticFailedStudentBySemesterScreen from '../../view/screens/app-screens/StatisticFailedStudentsBySemester/StatisticFailedStudentBySemesterScreen';
import StatisticWeakStudentsScreen from '../../view/screens/app-screens/StatisticWeakStudents/StatisticWeakStudentsScreen';
import StudentProfileScreen from '../../view/screens/app-screens/StudentProfile/StudentProfileScreen';
import StatisticDebtStudentBySemester from '../../view/screens/app-screens/StatisticDebtStudentBySemester/StatisticDebtStudentBySemesterScreen';
import EditFeedScreen from '../../view/screens/app-screens/FeedScreen/EditFeedScreen/EditFeedScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { appColor } from '../../view/styles/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { selectCurrentClass } from '../../redux/state/class/slice';
import AppBarWithDrawerToggle from '../../view/components/common/AppBarWithDrawerToggle/AppBarWithDrawerToggle';
import ChatZoneScreen from '../../view/screens/app-screens/ChatZoneScreen/ChatZoneScreen';
import { resetUnreadMessages, selectUnreadMessages } from '../../redux/state/message/slice';
import ClassSettingScreen from '../../view/screens/app-screens/ClassSetting/ClassSettingScreen';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const Tab = createBottomTabNavigator();

export const FeedStack = () => (
  <Stack.Navigator
    initialRouteName={ScreenName.LIST_FEED_SCREEN}
    screenOptions={commonScreenOptions}>
    <Stack.Screen name={ScreenName.LIST_FEED_SCREEN} component={ListFeedScreen} />
    <Stack.Screen name={ScreenName.CREATE_FEED_SCREEN} component={CreateFeedScreen} />
    <Stack.Screen name={ScreenName.FEED_DETAIL_SCREEN} component={FeedDetailScreen} />
    <Stack.Screen name={ScreenName.EDIT_FEED_SCREEN} component={EditFeedScreen} />
  </Stack.Navigator>
);

export const StudyPlanStack = () => (
  <Stack.Navigator
    initialRouteName={ScreenName.LIST_STUDY_PLAN_SCREEN}
    screenOptions={commonScreenOptions}>
    <Stack.Screen name={ScreenName.LIST_STUDY_PLAN_SCREEN} component={ListStudyPlanScreen} />
    <Stack.Screen name={ScreenName.CREATE_STUDY_PLAN_SCREEN} component={CreateStudyPlanScreen} />
    <Stack.Screen name={ScreenName.UPDATE_STUDY_PLAN_SCREEN} component={EditStudyPlanScreen} />
  </Stack.Navigator>
);

export const ClassMemberStack = () => (
  <Stack.Navigator
    initialRouteName={ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN}
    screenOptions={commonScreenOptions}>
    <Stack.Screen name={ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN} component={ClassMembersScreen} />
    <Stack.Screen name={ScreenName.STUDENT_SCORE_SCREEN} component={StudentScoreScreen} />
    <Stack.Screen name={ScreenName.STUDENT_TIME_TABLE_SCREEN} component={StudentTimeTableScren} />
    <Stack.Screen name={ScreenName.STUDENT_PROFILE_SCREEN} component={StudentProfileScreen} />
    <Stack.Screen name={ScreenName.CLASS_SETTING_SCREEN} component={ClassSettingScreen} />
    <Stack.Screen
      name={ScreenName.STATISTIC_DEBT_STUDENTS_BY_SEMESTER}
      component={StatisticDebtStudentBySemester}
    />
    <Stack.Screen
      name={ScreenName.STATISTIC_FAILED_STUDENTS_BY_SEMESTER_SCREEN}
      component={StatisticFailedStudentBySemesterScreen}
    />
    <Stack.Screen
      name={ScreenName.STUDENT_LESSON_PATH_SCREEN}
      component={StudentLessonPathScreen}
    />
    <Stack.Screen
      name={ScreenName.STATISTIC_WEAK_STUDENTS_BY_SEMESTER_SCREEN}
      component={StatisticWeakStudentsScreen}
    />
  </Stack.Navigator>
);

export const StreamTabStack = () => (
  <TopTab.Navigator
    screenOptions={({ route }: { route: any }) => ({
      tabBarIcon: ({ color }: { color: string }) => {
        switch (route.name) {
          case ScreenName.FEED_STACK: {
            return (
              <MaterialCommunityIcons name="message-processing-outline" size={25} color={color} />
            );
          }
          case ScreenName.STUDY_PLAN_STACK: {
            return <MaterialCommunityIcons name="timeline-text-outline" size={25} color={color} />;
          }

          default:
            return <AntDesignIcon name="questioncircleo" size={25} color={color} />;
        }
      },
    })}
    tabBarOptions={{
      activeTintColor: appColor.primaryColor,
      inactiveTintColor: 'gray',
      showIcon: true,
      showLabel: false,
    }}
    initialRouteName={ScreenName.FEED_STACK}>
    <TopTab.Screen name={ScreenName.FEED_STACK} component={FeedStack} />
    <TopTab.Screen name={ScreenName.STUDY_PLAN_STACK} component={StudyPlanStack} />
  </TopTab.Navigator>
);

export const StreamStackWithAppBar = ({ navigation }: { navigation: any }) => {
  const currentClass = useSelector(selectCurrentClass);

  return (
    <>
      <AppBarWithDrawerToggle
        titleCustomStyle={{ fontSize: 22 }}
        navigation={navigation}
        title={`Lớp ${currentClass.code}`}
      />
      <StreamTabStack />
    </>
  );
};

export const MainTabStack = () => {
  const unreadMessages = useSelector(selectUnreadMessages);
  const dispatch = useDispatch();

  const onPressChatTab = () => {
    dispatch({ type: resetUnreadMessages.type });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ color, size }: { focused: any; color: any; size: any }) => {
          let iconName;

          switch (route.name) {
            case ScreenName.PROFESSOR_STREAM_SCREEN: {
              iconName = 'home';
              break;
            }
            case ScreenName.PROFESSOR_CHAT_ZONE_SCREEN: {
              iconName = 'comments';
              break;
            }
            case ScreenName.CLASS_MEMBER_STACK: {
              iconName = 'user-friends';
              break;
            }

            default:
              iconName = 'coffee';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: appColor.primaryColor,
        inactiveTintColor: 'gray',
        showLabel: false,
      }}
      initialRouteName={ScreenName.PROFESSOR_STREAM_SCREEN}>
      <Tab.Screen name={ScreenName.PROFESSOR_STREAM_SCREEN} component={StreamStackWithAppBar} />
      <Tab.Screen
        name={ScreenName.PROFESSOR_CHAT_ZONE_SCREEN}
        listeners={{
          tabPress: () => {
            onPressChatTab();
          },
        }}
        component={ChatZoneScreen}
        options={{
          tabBarBadge: unreadMessages > 0 ? unreadMessages : null,
        }}
      />
      <Tab.Screen name={ScreenName.CLASS_MEMBER_STACK} component={ClassMemberStack} />
    </Tab.Navigator>
  );
};

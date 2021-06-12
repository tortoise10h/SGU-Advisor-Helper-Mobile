import React from 'react';
import { useSelector } from 'react-redux';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ScreenName from '../../common/constants/screen-name';
import CommonDrawer from '../../view/components/common/CommonDrawer/CommonDrawer';
import { appColor } from '../../view/styles/color';
import { ClassMemberStack, MainTabStack, StreamTabStack } from './Common';
import ClassWorkScreen from '../../view/screens/app-screens/ClassWorkScreen/ClassWorkScreen';
import ChatZoneScreen from '../../view/screens/app-screens/ChatZoneScreen/ChatZoneScreen';
import AppBarWithDrawerToggle from '../../view/components/common/AppBarWithDrawerToggle/AppBarWithDrawerToggle';
import { selectCurrentClass } from '../../redux/state/class/slice';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export const StudentStreamStack = ({ navigation }: { navigation: any }) => {
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
export const StudentTabStack = () => (
  <Tab.Navigator
    screenOptions={({ route }: { route: any }) => ({
      tabBarIcon: ({ color, size }: { focused: any; color: any; size: any }) => {
        let iconName;

        switch (route.name) {
          case ScreenName.PROFESSOR_STREAM_SCREEN: {
            iconName = 'home';
            break;
          }
          case ScreenName.PROFESSOR_CLASS_WORK_SCREEN: {
            iconName = 'chalkboard-teacher';
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
    <Tab.Screen name={ScreenName.PROFESSOR_STREAM_SCREEN} component={StudentStreamStack} />
    <Tab.Screen name={ScreenName.PROFESSOR_CLASS_WORK_SCREEN} component={ClassWorkScreen} />
    <Tab.Screen name={ScreenName.PROFESSOR_CHAT_ZONE_SCREEN} component={ChatZoneScreen} />
    <Tab.Screen name={ScreenName.CLASS_MEMBER_STACK} component={ClassMemberStack} />
  </Tab.Navigator>
);

export const StudentStack = () => (
  <Drawer.Navigator
    initialRouteName={ScreenName.STUDENT_TAB_STACK}
    drawerContent={(props: any) => <CommonDrawer {...props} />}>
    <Drawer.Screen name={ScreenName.STUDENT_TAB_STACK} component={MainTabStack} />
  </Drawer.Navigator>
);

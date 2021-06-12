import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { commonScreenOptions } from '../configs';
import ScreenName from '../../common/constants/screen-name';
import ProfessorHomeScreen from '../../view/screens/app-screens/ProfessorSpecificScreens/HomeScreen/HomeScreen';
import ProfessorClassWorkScreen from '../../view/screens/app-screens/ClassWorkScreen/ClassWorkScreen';
import ProfessorChatZoneScreen from '../../view/screens/app-screens/ChatZoneScreen/ChatZoneScreen';
import CommonDrawer from '../../view/components/common/CommonDrawer/CommonDrawer';
import { appColor } from '../../view/styles/color';
import AppBarWithDrawerToggle from '../../view/components/common/AppBarWithDrawerToggle/AppBarWithDrawerToggle';
import { selectCurrentClass } from '../../redux/state/class/slice';
import { ClassMemberStack, MainTabStack, StreamTabStack } from './Common';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export const ProfessorAppStack = () => (
  <Stack.Navigator initialRouteName={ScreenName.PROFESSOR_HOME_SCREEN}>
    <Stack.Screen
      name={ScreenName.PROFESSOR_HOME_SCREEN}
      component={ProfessorHomeScreen}
      options={commonScreenOptions}
    />
  </Stack.Navigator>
);

export const ProfessorStreamStack = ({ navigation }: { navigation: any }) => {
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

export const ProfessorTabStack = () => (
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
    <Tab.Screen name={ScreenName.PROFESSOR_STREAM_SCREEN} component={ProfessorStreamStack} />
    <Tab.Screen
      name={ScreenName.PROFESSOR_CLASS_WORK_SCREEN}
      component={ProfessorClassWorkScreen}
    />
    <Tab.Screen name={ScreenName.PROFESSOR_CHAT_ZONE_SCREEN} component={ProfessorChatZoneScreen} />
    <Tab.Screen name={ScreenName.CLASS_MEMBER_STACK} component={ClassMemberStack} />
  </Tab.Navigator>
);

export const ProfessorStack = () => (
  <Drawer.Navigator
    initialRouteName={ScreenName.PROFESSOR_APP_STACK}
    drawerContent={(props: any) => <CommonDrawer {...props} />}>
    <Drawer.Screen name={ScreenName.PROFESSOR_APP_STACK} component={ProfessorAppStack} />
    <Drawer.Screen name={ScreenName.PROFESSOR_TAB_STACK} component={MainTabStack} />
  </Drawer.Navigator>
);

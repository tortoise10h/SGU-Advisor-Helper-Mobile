import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { commonScreenOptions } from '../configs';

import ScreenName from '../../common/constants/screen-name';
import LoginScreen from '../../view/screens/auth-screens/LoginScreen/LoginScreen';

const Stack = createStackNavigator();

export const AuthenticationStack = () => (
  <Stack.Navigator
    initialRouteName={ScreenName.LOGIN_SCREEN}
    screenOptions={commonScreenOptions}>
    <Stack.Screen name={ScreenName.LOGIN_SCREEN} component={LoginScreen} />
  </Stack.Navigator>
);

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReactNativePaperProvider } from 'react-native-paper';
import { getStackByUser } from '../../../src/navigators/handler';
import LoadingModal from '../../view/components/common/LoadingModal';
import { APP_THEME } from '../../config';
import { PersistHandlers, PersistKeys } from '../persistent-store';
import { IUserToken } from '../interfaces/user';
import { selectUser, selectUserLoginAt } from '../../redux/state/user/slice';
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash';
import GlobalProgressBar from '../../view/components/common/GlobalProgressBar/GlobalProgressBar';
import { getUserInfoBySguIdAction } from '../../redux/state/user/saga-types';
import { navigationRef } from '../utils/root-navigation';

const Root = () => {
  const user = useSelector(selectUser);
  const userLoginAt = useSelector(selectUserLoginAt);
  const dispatch = useDispatch();

  console.log('[Root] user: ', user);

  const [userToken, setUserToken] = useState({
    accessToken: '',
    accessTokenExpiresIn: '',
    refreshToken: '',
    refreshTokenExpiresIn: '',
  } as IUserToken);
  const [role, setRole] = useState('');

  const setUserTokenAndRole = useCallback(async () => {
    try {
      const userTokenStr = await PersistHandlers.getItem(PersistKeys.USER_TOKEN_KEY);
      const userSguId = await PersistHandlers.getItem(PersistKeys.USER_SGU_ID_KEY);
      const userTokenInStorage = JSON.parse(userTokenStr || '{}');
      const roleInStorage = (await PersistHandlers.getItem(PersistKeys.USER_ROLE_KEY)) || '';

      if (!_.isEmpty(userSguId)) {
        dispatch({
          type: getUserInfoBySguIdAction.type,
          payload: {
            sguId: userSguId,
          },
        });
      }

      setUserToken(userTokenInStorage);
      setRole(roleInStorage);
    } catch (error) {
      console.log('[Root] -> setUserTokenAndRole -> error: ', error);
    }
  }, []);

  useEffect(() => {
    setUserTokenAndRole();
  }, [userLoginAt]);

  const AppStack = getStackByUser(userToken, role);

  return (
    <ReactNativePaperProvider theme={APP_THEME}>
      <MenuProvider>
        <NavigationContainer ref={navigationRef}>
          <GlobalProgressBar />
          <LoadingModal />
          <AppStack />
        </NavigationContainer>
      </MenuProvider>
    </ReactNativePaperProvider>
  );
};

export default Root;

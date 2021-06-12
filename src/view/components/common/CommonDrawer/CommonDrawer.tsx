import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import {  DrawerContentScrollView } from '@react-navigation/drawer';
import { Title, Caption, Drawer, Button, TouchableRipple } from 'react-native-paper';
import { Avatar } from 'react-native-elements';

import { logoutAction } from '../../../../redux/state/user/saga-types';
import styles from './styles';
import { UserRole } from '../../../../common/constants/user';
import ProfessorDrawerItems from './components/ProfessorDrawerItems';
import { selectUser } from '../../../../redux/state/user/slice';
import ScreenName from '../../../../common/constants/screen-name';
import { CommonActions } from '@react-navigation/native';

const CommonDrawer = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const currentUserRole = user.role;

  const renderDrawerItemsBasedOnRole = () => {
    switch (currentUserRole) {
      case UserRole.LECTURER: {
        return <ProfessorDrawerItems navigation={navigation} />;
      }

      default:
        return <></>;
    }
  };

  const onPressLogout = () => {
    let resetAction;

    switch (currentUserRole) {
      case UserRole.LECTURER: {
        resetAction = {
          index: 0,
          routes: [
            {
              name: ScreenName.PROFESSOR_APP_STACK,
            },
          ],
        };
        break;
      }
      case UserRole.STUDENT: {
        resetAction = {
          index: 0,
          routes: [
            {
              name: ScreenName.STUDENT_TAB_STACK,
            },
          ],
        };
        break;
      }
    }

    navigation.dispatch(CommonActions.reset(resetAction));
    dispatch(logoutAction(null));
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar
            size={50}
            title={user.firstName ? user.firstName.slice(0, 1) : null}
            avatarStyle={{ backgroundColor: '#eaeaea' }}
            rounded
          />
          <Title style={styles.title}>
            {user.lastName} {user.firstName}
          </Title>
          <Caption style={styles.caption}>{user.email}</Caption>
        </View>

        <View style={{ flex: 5 }}>
          <Drawer.Section style={styles.drawerSection}>
{/* <DrawerItem */}
{/* icon={({ color, size }) => <AntDesignIcon name="user" color={color} size={size} />} */}
{/* label="Tài khoản" */}
{/* onPress={() => {}} */}
{/* /> */}
            {renderDrawerItemsBasedOnRole()}
          </Drawer.Section>
        </View>

        <View style={{ flex: 1 }}>
          <TouchableRipple rippleColor="#5468ff">
            <Button onPress={onPressLogout} labelStyle={{ color: '#696969' }}>
              Đăng xuất
            </Button>
          </TouchableRipple>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default CommonDrawer;

import React from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenName from '../../../../../common/constants/screen-name';

const ProfessorDrawerItems = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="google-classroom" color={color} size={size} />
        )}
        label="Lớp của bạn"
        onPress={() => navigation.navigate(ScreenName.PROFESSOR_HOME_SCREEN)}
      />
    </>
  );
};

export default ProfessorDrawerItems;

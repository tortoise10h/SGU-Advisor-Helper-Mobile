import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import AppHeaderText from './AppHeaderText';

const AppBarWithDrawerToggle = ({
  navigation,
  title,
  titleCustomStyle,
  bonusActionComponent,
}: {
  navigation: any;
  title: string;
  titleCustomStyle?: any,
  bonusActionComponent?: React.ReactNode,
}) => {
  return (
    <View>
      <Appbar.Header style={{ backgroundColor: '#fff' }}>
        <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
        <Appbar.Content
          title={<AppHeaderText text={title} customStyle={{ color: '#404043', ...titleCustomStyle }} />}
          style={{ marginLeft: 5 }}
        />
        {bonusActionComponent}
      </Appbar.Header>
    </View>
  );
};

export default AppBarWithDrawerToggle;

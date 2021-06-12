import React, { useState } from 'react';
import { SpeedDial } from 'react-native-elements';
import ScreenName from '../../../../../common/constants/screen-name';
import { appColor } from '../../../../styles/color';

const FloatingCreateButton = ({ navigation }: { navigation: any }) => {
  const [open, setOpen] = useState(false);

  const onPressCreatePostItem = () => {
    setOpen(false);
    navigation.navigate(ScreenName.CREATE_FEED_SCREEN);
  };

  const onPressCreateStudyPlanItem = () => {
    setOpen(false);
    navigation.navigate(ScreenName.CREATE_STUDY_PLAN_SCREEN);
  };

  return (
    <SpeedDial
      isOpen={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      icon={{ name: 'add', color: '#fff' }}
      buttonStyle={{ borderRadius: 50 }}
      openIcon={{ name: 'close', color: '#fff' }}
      color={appColor.primaryColor}>
      <SpeedDial.Action
        icon={{ name: 'post-add', color: '#fff' }}
        title="Đăng bài"
        color={appColor.primaryColor}
        onPress={onPressCreatePostItem}
      />
      <SpeedDial.Action
        icon={{ name: 'timeline', color: '#fff' }}
        title="Tạo kế hoạch học tập"
        color={appColor.primaryColor}
        onPress={onPressCreateStudyPlanItem}
      />
    </SpeedDial>
  );
};

export default FloatingCreateButton;

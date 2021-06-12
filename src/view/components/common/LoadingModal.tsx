import React from 'react';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { Overlay } from 'react-native-elements';

const LoadingModal = () => {
  const globalLoading = useSelector((state: any) => state.global.loading);

  return (
    <Overlay
      isVisible={globalLoading}
      overlayStyle={{ elevation: 0, backgroundColor: 'transparent' }}>
      <ActivityIndicator size="large" animating={true} color={Colors.blue100} />
    </Overlay>
  );
};

export default LoadingModal;

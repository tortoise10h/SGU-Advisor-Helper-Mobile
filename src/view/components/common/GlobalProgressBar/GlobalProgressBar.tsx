import React from 'react';
import { ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';

const GlobalProgressBar = () => {
  const progessBarLoading = useSelector((state: any) => state.global.progressBarLoading);

  return (
    <ProgressBar indeterminate={true} visible={progessBarLoading} progress={0.8} color="#77dd77" />
  );
};

export default GlobalProgressBar;

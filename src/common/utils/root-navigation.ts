import React from 'react';

export const navigationRef: any = React.createRef();
export const mainTabRef: any = React.createRef();

export const navigate = (name: string, params?: any) => {
  if (navigationRef) {
    navigationRef.current?.navigate(name, params);
  }
};

export const getCurrentRouteName = () => {
  return navigationRef.current?.getCurrentRoute()?.name;
};

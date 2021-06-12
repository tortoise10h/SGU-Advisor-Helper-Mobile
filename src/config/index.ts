// @ts-ignore
import { API_URL, FILE_UPLOAD_LIMIT_SIZE } from 'react-native-dotenv';
import {  Dimensions } from "react-native";
import { DefaultTheme } from 'react-native-paper';
import { appColor } from '../view/styles/color';

export const APP_THEME = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: appColor.primaryColor,
  },
};

const window = Dimensions.get("window");

export const API_DEFAULT_URL = API_URL;
export const WINDOW_HEIGHT = window.height;
export const WINDOW_WIDTH = window.width;
export const FILE_UPLOAD_LIMIT = FILE_UPLOAD_LIMIT_SIZE;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

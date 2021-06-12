import { StyleSheet } from 'react-native';
import { appColor } from '../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.lightBackgroundColor,
  },
  tableItem: {
    alignSelf: 'stretch',
    color: appColor.textBlackColor,
  },
  summaryItemTitle: {
    fontWeight: '700',
    color: appColor.textBlackColor,
  },
});

export default styles;

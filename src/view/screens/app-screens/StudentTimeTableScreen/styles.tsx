import { StyleSheet } from 'react-native';
import { appColor } from '../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.whiteBackgroundColor,
  },
  header: { height: 30, backgroundColor: appColor.primaryColor },
  text: { textAlign: 'center', fontWeight: '100', padding: 10 },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
  changeWeekButton: {
    backgroundColor: appColor.primaryColor,
    color: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default styles;

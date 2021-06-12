import { StyleSheet } from 'react-native';
import { appColor } from '../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.lightBackgroundColor,
  },
  semesterPickerItem: {
    padding: 10,
  },
  scoreItem: {
    marginVertical: 10,
  },
  semesterSummaryContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
});

export default styles;

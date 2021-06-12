import { StyleSheet } from 'react-native';
import { appColor } from '../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.whiteBackgroundColor,
  },
  scoreItem: {
    marginVertical: 10,
  },
  statisticSummaryContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  statisticSummaryTitle: {
    color: appColor.textBlackColor,
    fontWeight: 'bold',
  },
  statisticSummaryText: {
    color: 'red',
    fontWeight: '700',
  },
});

export default styles;

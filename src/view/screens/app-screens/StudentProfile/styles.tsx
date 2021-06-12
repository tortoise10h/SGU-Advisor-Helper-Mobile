import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../../config';
import { appColor } from '../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.lightBackgroundColor,
  },
  infoContainer: {
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  infoItemContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTitle: {
    color: appColor.textBlackColor,
    fontWeight: '700',
    fontSize: 16,
  },
  infoText: {
    color: appColor.textBlackColor,
    fontSize: 16,
  },
  noteModal: {
    backgroundColor: 'white',
    padding: 10,
    height: (WINDOW_HEIGHT * 60) / 100,
    width: (WINDOW_WIDTH * 80) / 100,
    marginLeft: (WINDOW_WIDTH * 10) / 100,
  },
});

export default styles;

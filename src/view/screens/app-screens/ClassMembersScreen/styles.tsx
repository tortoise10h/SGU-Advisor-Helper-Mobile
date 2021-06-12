import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../../config';
import { appColor } from '../../../styles/color';

const modalHeight = WINDOW_HEIGHT - (WINDOW_HEIGHT * 20) / 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.lightBackgroundColor,
  },
  settingModalContainer: {
    backgroundColor: '#fff',
    height: modalHeight,
    marginHorizontal: (WINDOW_WIDTH * 8) / 100,
    padding: 10,
  },
  settingModalContentContainer: {
    flex: 1,
    padding: 10,
  },
  settingModalContentTitleContainer: {
    flex: 1,
  },
  settingModalContentTitle: {
    fontSize: 25,
    marginLeft: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  settingModalContentMainContainer: {
    marginTop: 10,
    flex: 8,
  },
  settingJoinClassCode: {
    fontWeight: 'bold',
  },
  searchBar: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  listUserTitle: {
    marginLeft: (WINDOW_WIDTH * 8) / 100,
    paddingVertical: 10,
    color: '#333',
    fontSize: 25,
  },
  listUserItemContainerStyle: {
    borderRadius: 10,
    elevation: 1.5,
    marginVertical: 3,
    backgroundColor: '#fff',
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
  },
  listUserItemStyle: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  listUserAvatar: {
    backgroundColor: '#bababa',
    marginRight: 5,
  },
});

export default styles;

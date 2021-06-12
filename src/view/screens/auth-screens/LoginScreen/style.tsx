import { StyleSheet } from 'react-native';
import { appColor } from '../../../styles/color';
import { WINDOW_WIDTH } from '../../../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.primaryColor,
  },
  headerText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  inputBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    marginBottom: 15,
    fontSize: 17,
    paddingLeft: 2,
    fontWeight: '700',
    color: '#4c596f',
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
  },
  textInputWithIcon: {
    flex: 1,
    marginHorizontal: (WINDOW_WIDTH * 4) / 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    elevation: 4,
  },
  textInputErrorText: {
    marginTop: 10,
    paddingLeft: 5,
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
    color: 'red',
  },
  inputIcon: {
    marginTop: 15,
    marginHorizontal: 5,
  },
  loginBtn: {
    paddingLeft: 10,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: appColor.primaryColor,
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
  },
  loginBtnIconContainer: {
    backgroundColor: appColor.hardPrimaryColor,
  },
  loginBtnText: {
    fontSize: 18,
  },
  registerBtnText: {
    color: '#696969',
    textTransform: 'none',
    fontWeight: 'normal',
  },
  stepScreenContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#f3f5f9',
  },
  newAccountInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: (WINDOW_WIDTH * 3) / 100,
    padding: 10,
    elevation: 3,
  },
  showAccountInfoNextBtn: {
    paddingLeft: 10,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: appColor.primaryColor,
    marginHorizontal: (WINDOW_WIDTH * 3) / 100,
  },
});

export default styles;

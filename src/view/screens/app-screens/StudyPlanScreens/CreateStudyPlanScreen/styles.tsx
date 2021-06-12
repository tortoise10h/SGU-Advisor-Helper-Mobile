import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../../../config';
import { appColor } from '../../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.lightBackgroundColor,
  },
  createPostContainer: {
    paddingTop: 10,
  },
  createPostTitle: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '700',
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 5,
  },
  createPostFormContainer: {
    paddingHorizontal: (WINDOW_WIDTH * 3) / 100,
    marginTop: (WINDOW_HEIGHT * 3) / 100,
  },
  createPostFormInput: {
    marginTop: (WINDOW_HEIGHT * 2) / 100,
    borderColor: 'transparent',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    paddingVertical: 3,
  },
  pickFilesContainer: {
    paddingHorizontal: (WINDOW_WIDTH * 5) / 100,
    marginBottom: 10,
  },
  pickFilesBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 3,
    borderColor: appColor.primaryColor,
    marginTop: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
  },
  submitPostContainer: {
    paddingHorizontal: (WINDOW_WIDTH * 5) / 100,
    marginBottom: 4,
  },
  submitPostBtn: {
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: appColor.primaryColor,
  },
  submitPostBtnTitle: {
    fontSize: 15,
    textTransform: 'uppercase',
  },
});

export default styles;

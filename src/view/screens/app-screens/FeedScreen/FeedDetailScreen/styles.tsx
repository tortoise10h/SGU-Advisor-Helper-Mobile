import { StyleSheet } from 'react-native';
import {WINDOW_WIDTH} from '../../../../../config';
import { appColor } from '../../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.whiteBackgroundColor,
  },
  headerNavigationContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
  },
  headerContainer: {
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
    marginTop: 10,
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  headerCreatedAt: {
    marginTop: 5,
    color: appColor.textBlackColor,
  },
  headerAuthorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerAuthorAvatar: {
    flex: 2,
  },
  headerAuthorName: {
    flex: 5,
  },
  headerAuthorPositionContainer: {
    flex: 3,
  },
  metadataContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  postMetadataContainer: {
    flex: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  postMetadataText: {
    color: appColor.textBlackColor,
    flex: 3,
  },
  loadMoreCommentsContainer: {
    marginHorizontal: (WINDOW_WIDTH * 5) / 100,
    marginBottom: 10,
    marginTop: 20,
  },
});

export default styles;

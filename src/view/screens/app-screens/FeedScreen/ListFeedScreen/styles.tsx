import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '../../../../../config';
import { appColor } from '../../../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.lightBackgroundColor,
  },
  postTag: {
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'green',
    color: '#fff',
  },
  feedCardParentContainer: {
    flex: 1,
    marginHorizontal: (WINDOW_WIDTH * 3) / 100,
    marginVertical: 10,
  },
  feedCardContainer: {
    borderRadius: 10,
    elevation: 3,
  },
  feedCardTitle: {
    paddingVertical: 10,
    marginTop: 15,
  },
  feedCardAuthorInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  feedCardAuthorAvatar: {
    marginRight: (WINDOW_WIDTH * 2) / 100,
    backgroundColor: '#eaeaea',
  },
  feedCardAuthorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  feedCardAuthorBadgeStyle: {
    padding: 5,
  },
  feedCardAuthorBadgeContainerStyle: {
    marginHorizontal: 5,
    marginTop: 3,
  },
  feedCardContentContainer: {
    marginTop: 10,
    paddingVertical: 10,
  },
  feedCardActionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedCardActionButtonZone: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  feedCardActionBtnLabel: {
    color: '#333',
  },
});

export default styles;

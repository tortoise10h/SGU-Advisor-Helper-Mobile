import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  listTitle: {
    fontWeight: '700',
    color: '#2c2e47',
    fontSize: 25,
    paddingTop: (WINDOW_HEIGHT * 2) / 100,
    marginLeft: (WINDOW_WIDTH * 2) / 100,
  },
  classItem: {
    height: 120,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flex: 1,
    borderRadius: 8,
  },
  classItemTitle: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  classItemSubTextZone: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  classItemSubText: {
    color: '#fff',
    flex: 1,
  },
});

export default styles;

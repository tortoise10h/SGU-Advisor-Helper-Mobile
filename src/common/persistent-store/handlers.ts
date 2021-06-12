import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log('Persit [setItem]  err: ', err);
  }
};

const getItem = async (key: string) => {
  try {
   return await AsyncStorage.getItem(key);
  } catch(err) {
    console.log('Persit [getItem]  err: ', err);
  }
};

const getItemAsObject = async (key: string) => {
  try {
   const result = await AsyncStorage.getItem(key);
   return result ? JSON.parse(result) : null;
  } catch(err) {
    console.log('Persit [getItemAsObject]  err: ', err);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.log('Persit [clearAllStorage]  err: ', err);
  }
};

export default {
  setItem,
  getItem,
  clearAll,
  getItemAsObject,
};

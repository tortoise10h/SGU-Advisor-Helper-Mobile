import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    padding: 5,
  },
});

const printSomethingOut = () => {
  console.log('Hello world');
};

const ItemComponent = () => {
  return (
    <View>
      <Text>Some text here</Text>
      <Button onPress={printSomethingOut}>Print</Button>
    </View>
  );
};

const BlockComponent = () => {
  return (
    <View style={styles.container}>
      <ItemComponent />
      <ItemComponent />
      <ItemComponent />
    </View>
  );
};

export default BlockComponent;

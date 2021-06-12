import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

const InfoItem = ({ title, text }: { title: string; text: string }) => {
  return (
    <View style={styles.infoItemContainer}>
      <View>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <View>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
};

export default InfoItem;

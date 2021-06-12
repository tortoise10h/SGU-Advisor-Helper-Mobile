import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';

const StudentInfoListItem = ({ title, content }: { title: string, content: string }) => {
  return (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title style={{ fontSize: 18 }}>{title}</ListItem.Title>
      </ListItem.Content>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{content}</Text>
    </ListItem>
  );
};

export default StudentInfoListItem;

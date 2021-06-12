import React from 'react';
import { View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';
import { AudioMimes, ImageMimes, VideoMimes } from '../../../../../common/constants/file-mime';

const FileItemLeftIcon = ({ file, containerStyle }: { file: any; containerStyle?: any }) => {
  const getIcon = () => {
    if (ImageMimes.includes(file.type)) {
      return (
        <Avatar
          containerStyle={{ flex: 2 }}
          avatarStyle={{
            width: 50,
            height: 50,
          }}
          source={{
            uri: file.url,
          }}
        />
      );
    }

    if (AudioMimes.includes(file.type)) {
      return <MaterialIcons name="multitrack-audio" size={25} color="#cab0e2" />;
    }

    if (VideoMimes.includes(file.type)) {
      return <MaterialIcons name="ondemand-video" size={25} color="#f8b28e" />;
    }

    switch (file.type) {
      case DocumentPicker.types.pdf: {
        return <MaterialCommunityIcons name="file-pdf" size={25} color="#f8423a" />;
      }
      case DocumentPicker.types.doc:
      case DocumentPicker.types.docx: {
        return <MaterialCommunityIcons name="microsoft-word" size={25} color="#0455b9" />;
      }
      case DocumentPicker.types.ppt:
      case DocumentPicker.types.pptx: {
        return <MaterialCommunityIcons name="microsoft-powerpoint" size={25} color="#bd362a" />;
      }
      case DocumentPicker.types.xls:
      case DocumentPicker.types.xlsx: {
        return <MaterialCommunityIcons name="microsoft-excel" size={25} color="#2a773c" />;
      }
    }
  };

  return (
    <View style={{ flex: 2, ...containerStyle }}>
      {getIcon()}
    </View>
  );
};;

export default FileItemLeftIcon;

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { IPickedFile } from '../interfaces';
import DocumentPicker from 'react-native-document-picker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';
import { AudioMimes, ImageMimes, VideoMimes } from '../../../../../../common/constants/file-mime';
import { WINDOW_WIDTH } from '../../../../../../config';
import { appColor } from '../../../../../styles/color';
import { getFileExtension } from '../../../../../../common/utils/common';

const PickedFileItem = ({
  file,
  onPressRemoveFile,
}: {
  file: IPickedFile;
  onPressRemoveFile: any;
}) => {
  const renderFileItemLeftIcon = () => {
    if (ImageMimes.includes(file.type)) {
      return (
        <Avatar
          containerStyle={{ flex: 2 }}
          avatarStyle={{
            width: 50,
            height: 50,
          }}
          source={{
            uri: file.uri,
          }}
        />
      );
    }

    if (AudioMimes.includes(file.type)) {
      return (
        <View style={{ flex: 2 }}>
          <MaterialIcons name="multitrack-audio" size={25} color="#cab0e2" />
        </View>
      );
    }

    if (VideoMimes.includes(file.type)) {
      return (
        <View style={{ flex: 2 }}>
          <MaterialIcons name="ondemand-video" size={25} color="#f8b28e" />
        </View>
      );
    }

    switch (file.type) {
      case DocumentPicker.types.pdf: {
        return (
          <View style={{ flex: 2 }}>
            <MaterialCommunityIcons name="file-pdf" size={25} color="#f8423a" />
          </View>
        );
      }
      case DocumentPicker.types.doc:
      case DocumentPicker.types.docx: {
        return (
          <View style={{ flex: 2 }}>
            <MaterialCommunityIcons name="microsoft-word" size={25} color="#0455b9" />
          </View>
        );
      }
      case DocumentPicker.types.ppt:
      case DocumentPicker.types.pptx: {
        return (
          <View style={{ flex: 2 }}>
            <MaterialCommunityIcons name="microsoft-powerpoint" size={25} color="#bd362a" />
          </View>
        );
      }
      case DocumentPicker.types.xls:
      case DocumentPicker.types.xlsx: {
        return (
          <View style={{ flex: 2 }}>
            <MaterialCommunityIcons name="microsoft-excel" size={25} color="#2a773c" />
          </View>
        );
      }
    }
  };

  const getDisplayFileName = () => {
    let displayFileName = file.name;
    if (file.name.length > 30) {
      displayFileName = `${file.name.slice(0,  25)}...${getFileExtension(file.name)}`;
    }

    return displayFileName;
  };

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: (WINDOW_WIDTH * 1) / 100,
        backgroundColor: '#fff',
        paddingVertical: 5,
        marginVertical: 5,
        borderRadius: 5,
        paddingHorizontal: 10,
      }}>
      <View
        style={{
          flex: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {renderFileItemLeftIcon()}
        <Text style={{ flex: 7, color: appColor.textBlackColor }}>{getDisplayFileName()}</Text>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => onPressRemoveFile(file)}>
          <AntDesignIcon name="close" size={18} color={appColor.textBlackColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PickedFileItem;

import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { AudioMimes, ImageMimes, VideoMimes } from '../../../../../../common/constants/file-mime';
import { appColor } from '../../../../../styles/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FileItemLeftIcon from '../../componennts/FileLeftIcon';
import RNFS from 'react-native-fs';
import moment from 'moment';
import { toggleProgressBarLoading } from '../../../../../../redux/state/global/slice';
import { toastSuccessSagaAction } from '../../../../../../redux/state/global/saga-types';
import mimeTypes from 'mime-types';

const FileItem = ({ file }: { file: any }) => {
  const dispatch = useDispatch();

  const onPressDownloadFile = () => {
    dispatch({ type: toggleProgressBarLoading.type });
    const downloadedFileNameParams = file.fileName.split('/');
    const downloadFileName = downloadedFileNameParams[downloadedFileNameParams.length - 1]
      .split('.').slice(0, -1);
/* const destinationPath = `${RNFS.DownloadDirectoryPath}/${moment().format('DD-MM-YYY hh:mm:ss:SS')}.${mimeTypes.extension(file.type)}`; */
    const destinationPath = `${RNFS.DownloadDirectoryPath}/${downloadFileName}-${moment().unix()}.${mimeTypes.extension(file.type)}`;

    console.log('[onPressDownloadFile] DocumentDirectoryPath: ', RNFS.DocumentDirectoryPath);
    RNFS.downloadFile({
      fromUrl: file.url,
      toFile: destinationPath,
    }).promise.then(() => {
      dispatch({
        type: toastSuccessSagaAction.type,
        payload: {
          title: 'Tải tệp hoàn tất',
          content: 'Tệp của bạn đã được tải hoàn tất, hãy kiểm tra thư mục download',
        },
      });
      dispatch({ type: toggleProgressBarLoading.type });
    }).catch(err => {
      console.log('[onPressDownloadFile] err: ', err);
      dispatch({ type: toggleProgressBarLoading.type });
    });
  };;

  const getFileNameDisplay = (fileName: string) => {
    if (fileName) {
      const fileNameParams = fileName.split('/');
      return fileNameParams[fileNameParams.length - 1];
    }

    return null;
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: appColor.lightBackgroundColor,
        alignItems: 'flex-start',
      }}>
      <FileItemLeftIcon file={file} />
      <Text style={{ flex: 6 }}>{getFileNameDisplay(file.fileName)}</Text>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        {ImageMimes.includes(file.type) ||
        VideoMimes.includes(file.type) ||
        AudioMimes.includes(file.type) ? (
          <TouchableOpacity onPress={() => Linking.openURL(file.url)}>
            <Ionicons style={{ marginTop: 3 }} name="eye-outline" size={20} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onPressDownloadFile}>
          <Ionicons name="download-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FileItem;

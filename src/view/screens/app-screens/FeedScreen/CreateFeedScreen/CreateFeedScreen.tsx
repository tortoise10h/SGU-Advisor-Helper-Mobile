import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from 'react-native-elements';
import { Button as PaperButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import * as yup from 'yup';
import { Formik } from 'formik';
import firebaseAuth from '@react-native-firebase/auth';

import ScreenName from '../../../../../common/constants/screen-name';
import styles from './styles';
import DocumentPicker from 'react-native-document-picker';
import PickedFileItem from './components/PickedFileItem';
import { IPostAttachment, IPickedFile } from './interfaces';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../../redux/state/global/saga-types';
import { FILE_UPLOAD_LIMIT } from '../../../../../config';
import {
  FILE_UPLOAD_PATH,
  uploadSingleFileToFirebasePromise,
} from '../../../../../common/utils/file-upload';
import { selectUser } from '../../../../../redux/state/user/slice';
import { selectCurrentClass } from '../../../../../redux/state/class/slice';
import { createPost } from '../../../../../redux/state/post/effects';
import { setPostLastChangedAt } from '../../../../../redux/state/post/slice';

const NewFeedSchema = yup.object({
  title: yup.string().required('Tiêu đề bài viết không được để trống'),
  content: yup.string().required('Nội dung bài viết không được để trống'),
});

const CreateFeedScreen = ({ navigation }: { navigation: any }) => {
  const [pickedFiles, setPickedFiles] = useState([] as any[]);

  const user = useSelector(selectUser);
  const currentClass = useSelector(selectCurrentClass);
  console.log('[CreateFeedScreen] user: ', user);
  console.log('[CreateFeedScreen] currentClass: ', currentClass);

  const dispatch = useDispatch();

  const authenAnonymousFrb = useCallback(() => {
    dispatch({ type: toggleLoadingAction.type });
    firebaseAuth()
      .signInAnonymously()
      .then(() => {
        dispatch({ type: toggleLoadingAction.type });
      })
      .catch(error => {
        dispatch({ type: toggleLoadingAction.type });
        if (error.code === 'auth/operation-not-allowed') {
          dispatch({
            type: setGlobalErrorAction.type,
            payload: {
              error:
                'Ứng dụng của bạn hiện chưa được cấp quyền để truy cập kho dữ liệu, xin liên hệ ngay với đội ngũ IT để được cấp quyền',
            },
          });
        }

        console.error(error);
      });
  }, []);

  useEffect(() => {
    authenAnonymousFrb();
  }, []);

  const onClose = () => {
    navigation.navigate(ScreenName.LIST_FEED_SCREEN);
  };

  const onPressRemoveFile = (file: IPickedFile) => {
    const newPickedFiles = pickedFiles.filter(
      (pickedFile: IPickedFile) => pickedFile.uri !== file.uri
    );

    setPickedFiles(newPickedFiles);
  };

  const onPressPickFiles = async () => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
          DocumentPicker.types.pdf,
          DocumentPicker.types.pptx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.xls,
          DocumentPicker.types.csv,
          DocumentPicker.types.audio,
          DocumentPicker.types.video,
        ],
        copyTo: 'documentDirectory',
      });

      console.log('[onPressPickFiles] FILE_UPLOAD_LIMIT: ', FILE_UPLOAD_LIMIT);

      /** Validate all picked files size */
      let arePickedFilesValid = true;
      if (results.some((res: any) => res.size > FILE_UPLOAD_LIMIT)) {
        dispatch({ type: toggleLoadingAction.type });
        const limitUploadMB = FILE_UPLOAD_LIMIT / 1024 / 1024;
        dispatch({
          type: setGlobalErrorAction.type,
          payload: { error: `Chỉ được phép tải lên file có dung lượng <= ${limitUploadMB} MB` },
        });
        arePickedFilesValid = false;
        return;
      }

      if (results.length > 10) {
        dispatch({ type: toggleLoadingAction.type });
        arePickedFilesValid = false;
        dispatch({
          type: setGlobalErrorAction.type,
          payload: { error: 'Chỉ được phép tải lên tối đa 10 file trên một bài viết' },
        });
        return;
      }

      if (arePickedFilesValid) {
        setPickedFiles(results);
      }
      dispatch({ type: toggleLoadingAction.type });
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const handleSubmitCreateFeed = async (values: any) => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      console.log('[handleSubmitCreateFeed] values: ', values);

      const uploadFilePromises: any = [];

      pickedFiles.forEach((file: any) => {
        uploadFilePromises.push(
          uploadSingleFileToFirebasePromise(
            file,
            FILE_UPLOAD_PATH.getPostAttachmentPath(file.name, user.sguId)
          )
        );
      });

      const uploadFileResults: IPostAttachment[] = await Promise.all(uploadFilePromises);

      await createPost(currentClass.id, {
        title: values.title,
        content: values.content,
        attachments: uploadFileResults,
      });

      dispatch({ type: toggleLoadingAction.type });
      /** For making list feed reload */
      dispatch({ type: setPostLastChangedAt.type });

      navigation.navigate(ScreenName.LIST_FEED_SCREEN);
    } catch (err) {
      console.log('[CreateFeedScreen] err: ', err);
      dispatch({ type: toggleLoadingAction.type });
      dispatch({
        type: setGlobalErrorAction.type,
        payload: { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ title: '', content: '' }}
        validationSchema={NewFeedSchema}
        onSubmit={values => {
          handleSubmitCreateFeed(values);
        }}>
        {formikProps => (
          <>
            <KeyboardAwareScrollView style={{ flexGrow: 1 }}>
              <ScrollView>
                <View style={styles.createPostContainer}>
                  <Text style={styles.createPostTitle}>Đăng bài viết mới</Text>
                  <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <AntDesignIcon name="close" size={25} />
                  </TouchableOpacity>
                </View>
                <View>
                  <View style={styles.createPostFormContainer}>
                    <Input
                      label="Tiêu đề"
                      inputContainerStyle={styles.createPostFormInput}
                      onChangeText={formikProps.handleChange('title')}
                      value={formikProps.values.title}
                      onBlur={formikProps.handleBlur('title')}
                      errorMessage={formikProps.errors.title}
                      placeholder="Nhập vào tiêu đề bài viết..."
                    />
                    <Input
                      label="Nội dung"
                      inputContainerStyle={styles.createPostFormInput}
                      placeholder="Nhập vào nội dung bài viết..."
                      numberOfLines={7}
                      multiline={true}
                      textAlignVertical="top"
                      onChangeText={formikProps.handleChange('content')}
                      value={formikProps.values.content}
                      onBlur={formikProps.handleBlur('content')}
                      errorMessage={formikProps.errors.content}
                    />
                  </View>
                  <View style={styles.pickFilesContainer}>
                    {pickedFiles.length
                      ? pickedFiles.map((file: IPickedFile, index: number) => (
                          <PickedFileItem
                            key={index}
                            file={file}
                            onPressRemoveFile={onPressRemoveFile}
                          />
                        ))
                      : null}
                    <PaperButton onPress={onPressPickFiles} style={styles.pickFilesBtn}>
                      Chọn file
                    </PaperButton>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAwareScrollView>
            <View style={styles.submitPostContainer}>
              <Button
                buttonStyle={styles.submitPostBtn}
                titleStyle={styles.submitPostBtnTitle}
                iconRight={true}
                icon={
                  <AntDesignIcon
                    name="checkcircle"
                    style={{ marginLeft: 10 }}
                    size={20}
                    color="#fff"
                  />
                }
                title="Đăng bài"
                onPress={() => formikProps.handleSubmit()}
              />
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateFeedScreen;

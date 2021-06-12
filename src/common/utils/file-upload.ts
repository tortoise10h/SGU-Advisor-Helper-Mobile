import storage from '@react-native-firebase/storage';
import { IPostAttachment, IPickedFile } from '../../view/screens/app-screens/FeedScreen/CreateFeedScreen/interfaces';
import moment from 'moment';

export const FILE_UPLOAD_PATH = {
  getPostAttachmentPath: (fileName: string, userId: string) => `/posts/${userId}/${fileName}-${moment().unix()}/${fileName}`,
};

export const uploadSingleFileToFirebasePromise = (file: IPickedFile, refFile: string) =>
  new Promise((resolve, reject) => {
    const uploadTask = storage().ref(refFile).putFile(file.fileCopyUri);

    uploadTask.on(
      storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (snapshot.state === storage.TaskState.RUNNING) {
          console.log(`Progress: ${progress}%`);
        }
      },
      err => {
        console.log('[uploadFile] err: ', err);
        reject(err);
      },
      async () => {
        const downloadURL = await uploadTask?.snapshot?.ref.getDownloadURL();
        console.log('DownloadURL: ', downloadURL);
        resolve({
          url: downloadURL,
          fileName: refFile,
          type: file.type,
        } as IPostAttachment);
      }
    );
  });

export const deleteSingleFileOnFirebasePromise = (refFile: string) =>
  new Promise((resolve, reject) => {
    const deleteTask = storage().ref(refFile);

    deleteTask
      .delete()
      .then(() => {
        resolve(refFile);
      })
      .catch(error => {
        reject(error);
      });
  });

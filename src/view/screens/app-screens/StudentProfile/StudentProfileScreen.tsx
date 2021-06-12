import React, { useEffect, useState, useCallback } from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Portal, Modal } from 'react-native-paper';
import ScreenName from '../../../../common/constants/screen-name';
import { appColor } from '../../../styles/color';
import { WINDOW_WIDTH } from '../../../../config';
import styles from './styles';
import InfoItem from './components/InfoItem';
import {
  convertStudentStudyState,
  convertUserGender,
  StudentStudyState,
} from '../../../../common/constants/user';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../redux/state/global/saga-types';
import { updateStudentInClassInfo } from '../../../../redux/state/class-member/effects';
import { selectCurrentClass } from '../../../../redux/state/class/slice';
import { getInfoBySGUId } from '../../../../redux/state/user/effects';
import { setLastChangedAt } from '../../../../redux/state/class-member/slice';

const StudentProfileScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const dispatch = useDispatch();

  const currentClass = useSelector(selectCurrentClass);

  const student = JSON.parse(route.params.member);

  const [noteModalVisibile, setNoteMoDalVisible] = useState(false);
  const [lastChanged, setLastChanged] = useState(null as any);
  const [studentInfo, setStudentInfo] = useState({} as any);
  const [studentNote, setStudentNote] = useState('');

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  const openNoteModal = () => {
    setNoteMoDalVisible(true);
  };

  const closeNoteModal = () => {
    setNoteMoDalVisible(false);
  };

  const handleUpdateNote = async (note: string) => {
    try {
      closeNoteModal();
      dispatch({ type: toggleLoadingAction.type });
      await updateStudentInClassInfo(currentClass.id, student.id, { note });
      setLastChanged(new Date());
      dispatch({ type: toggleLoadingAction.type });
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });

      console.log(
        '🔥🔥🔥  ▶️  file: StudentProfileScreen.tsx  ▶️  line 26  ▶️  handleUpdateNote  ▶️  err',
        err
      );
      dispatch({
        type: setGlobalErrorAction.type,
        payload: { error: 'Có lỗi xảy ra, xin vui lòng thử lại sau' },
      });
    }
  };

  const handleUpdateStudyState = async (studyState: StudentStudyState) => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      await updateStudentInClassInfo(currentClass.id, student.id, { status: studyState });
      setLastChanged(new Date());
      dispatch({ type: toggleLoadingAction.type });
      dispatch({ type: setLastChangedAt.type });
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });

      console.log(
        '🔥🔥🔥  ▶️  file: StudentProfileScreen.tsx  ▶️  line 26  ▶️  handleUpdateNote  ▶️  err',
        err
      );
      dispatch({
        type: setGlobalErrorAction.type,
        payload: { error: 'Có lỗi xảy ra, xin vui lòng thử lại sau' },
      });
    }
  };

  const fetchStudentInfo = useCallback(async () => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      const result = await getInfoBySGUId(student.sguId);
      if (result.data) {
        setStudentInfo(result.data);
        setStudentNote(result.data.memberships[0].note);
      }
      dispatch({ type: toggleLoadingAction.type });
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });

      dispatch({
        type: setGlobalErrorAction.type,
        payload: { error: 'Có lỗi xảy ra, xin vui lòng thử lại sau' },
      });
    }
  }, []);

  const getStudyStateColor = () => {
    if (studentInfo.memberships && studentInfo.memberships.length) {
      switch (studentInfo.memberships[0].status) {
        case StudentStudyState.DROPPED_OUT: {
          return 'red';
        }
        case StudentStudyState.COMPLETED: {
          return 'green';
        }
        case StudentStudyState.ACTIVE: {
          return appColor.primaryColor;
        }
      }
    }

    return appColor.primaryColor;
  };

  useEffect(() => {
    fetchStudentInfo();
  }, [lastChanged]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={navigateToClassMemberScreen}>
          <AntDesignIcon
            style={{ marginLeft: 5 }}
            name="arrowleft"
            size={25}
            color={appColor.hardPrimaryColor}
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100 }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: appColor.textBlackColor,
            fontSize: 25,
          }}>
          Thông tin sinh viên {studentInfo.lastName} {studentInfo.firstName}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <InfoItem title="Họ và tên: " text={`${studentInfo.lastName} ${studentInfo.firstName}`} />
        <InfoItem title="MSSV: " text={studentInfo.sguId} />
        <InfoItem title="Email: " text={studentInfo.email} />
        <InfoItem title="Giới tính: " text={convertUserGender(studentInfo.gender)} />
        <View style={{ ...styles.infoItemContainer, marginVertical: 10, alignItems: 'center' }}>
          <View>
            <Text style={styles.infoTitle}>Tình trạng học tập:</Text>
          </View>
          <View>
            <Menu>
              <MenuTrigger>
                <Button
                  mode="outlined"
                  style={{
                    borderColor: getStudyStateColor(),
                  }}
                  labelStyle={{
                    fontSize: 13,
                    color: getStudyStateColor(),
                  }}>
                  {convertStudentStudyState(
                    studentInfo.memberships && studentInfo.memberships.length
                      ? studentInfo.memberships[0].status
                      : ''
                  )}
                </Button>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  onSelect={() => handleUpdateStudyState(StudentStudyState.ACTIVE)}
                  text="Đang học"
                />
                <MenuOption
                  onSelect={() => handleUpdateStudyState(StudentStudyState.DROPPED_OUT)}
                  text="Đã nghỉ học"
                />
                <MenuOption
                  onSelect={() => handleUpdateStudyState(StudentStudyState.COMPLETED)}
                  text="Đã học xong"
                />
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <View style={{ ...styles.infoItemContainer, marginVertical: 10, alignItems: 'center' }}>
          <View>
            <Text style={styles.infoTitle}>Ghi chú:</Text>
          </View>
          <View>
            <Button
              mode="outlined"
              onPress={openNoteModal}
              style={{ borderColor: appColor.primaryColor }}
              labelStyle={{ fontSize: 13 }}>
              Xem ghi chú
            </Button>
          </View>
        </View>
      </View>
      <Portal>
        <Modal
          visible={noteModalVisibile}
          onDismiss={closeNoteModal}
          contentContainerStyle={styles.noteModal}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <TextInput
                multiline={true}
                numberOfLines={15}
                value={studentNote}
                onChangeText={(text: string) => setStudentNote(text)}
                style={{ backgroundColor: '#f9f9f9', padding: 10 }}
                textAlignVertical="top"
                placeholder={`Ghi chú của sinh viên ${studentInfo.lastName} ${studentInfo.firstName}`}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button
                mode="outlined"
                onPress={closeNoteModal}
                style={{ marginHorizontal: 5, borderColor: appColor.primaryColor }}>
                Đóng
              </Button>
              <Button mode="contained" onPress={() => handleUpdateNote(studentNote)}>
                Cập nhật
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default StudentProfileScreen;

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Button, Dialog, Portal } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

import ScreenName from '../../../../common/constants/screen-name';
import { appColor } from '../../../styles/color';
import { WINDOW_WIDTH } from '../../../../config';
import styles from './styles';
import FailedStudentItem from './components/FailedStudentItem';
import { selectCurrentClass } from '../../../../redux/state/class/slice';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../redux/state/global/saga-types';
import { statisticFailedStudentBySemester } from '../../../../redux/state/class-member/effects';
import { IFailedStudentData } from './interfaces';

const { Popover } = renderers;

interface ISemesterOfClass {
  semesterCode: string;
  semester: string;
}

const StatisticFailedStudentBySemesterScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const currentClass = useSelector(selectCurrentClass);
  console.log(
    '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 32  ▶️  StatisticFailedStudentBySemesterScreen  ▶️  currentClass',
    currentClass
  );
  const [semestersOfClass, setSemestersOfClass] = useState([] as ISemesterOfClass[]);
  const [summaryDialogVisible, setSummaryDialogVisible] = useState(false);
  const [summaryList, setSummaryList] = useState({} as any);
  const [listFailedStudents, setListFailedStudents] = useState([] as any[]);
  const [currentSemester, setCurrentSemester] = useState({} as ISemesterOfClass);

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  const generateListSemesterOfClass = () => {
    if (currentClass.schoolYearEnd && currentClass.schoolYearStart) {
      let result = [] as ISemesterOfClass[];

      for (let i = currentClass.schoolYearStart; i <= currentClass.schoolYearEnd; i++) {
        const semestersOfYear = [
          {
            semesterCode: `${i}1`,
            semester: `Học kỳ 1 năm học ${i} - ${i + 1}`,
          },
          {
            semesterCode: `${i}2`,
            semester: `Học kỳ 2 năm học ${i} - ${i + 1}`,
          },
          {
            semesterCode: `${i}3`,
            semester: `Học kỳ hè năm học ${i} - ${i + 1}`,
          },
        ] as ISemesterOfClass[];

        result = result.concat(semestersOfYear);
      }

      result = result.reverse();
      console.log(
        '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 64  ▶️  generateListSemesterOfClass  ▶️  result',
        result
      );
      setSemestersOfClass(result);
      setCurrentSemester(result[0]);
    }
  };

  useEffect(() => {
    generateListSemesterOfClass();
  }, [currentClass]);

  const onSelectSemesterOption = (semester: ISemesterOfClass) => {
    console.log(
      '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 82  ▶️  onSelectSemesterOption  ▶️  semester',
      semester
    );
    setCurrentSemester(semester);
  };

  const fetchListFailedStudentsBySemester = useCallback(
    async (classroomId: string, semesterCode: string) => {
      try {
        dispatch({ type: toggleLoadingAction.type });
        const result = await statisticFailedStudentBySemester(classroomId, semesterCode);
        const data = result?.data;
        console.log(
          '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 85  ▶️  fetchListFailedStudentsBySemester  ▶️  data',
          data
        );
        if (data) {
          setListFailedStudents(data);
        }
        dispatch({ type: toggleLoadingAction.type });
      } catch (err) {
        console.log(
          '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 75  ▶️  useEffect  ▶️  err',
          err
        );
        dispatch({ type: toggleLoadingAction.type });
        dispatch({ type: setGlobalErrorAction.type, payload: { error: 'Có lỗi xảy ra' } });
      }
    },
    []
  );

  const showSummaryList = () => {
    dispatch({ type: toggleLoadingAction.type });
    try {
      const summaryData: any = {};

      for (const student of listFailedStudents) {
        student.subjectScores.forEach((subjectScore: any) => {
          console.log(
            '=====> summaryData[subjectScore.subject.code]: ',
            summaryData[subjectScore.subject.code]
          );
          summaryData[subjectScore.subject.code] = summaryData[subjectScore.subject.code]
            ? {
                count: summaryData[subjectScore.subject.code].count + 1,
                name: subjectScore.subject.name,
              }
            : {
                name: subjectScore.subject.name,
                count: 1,
              };
        });
      }

      setSummaryList(summaryData);
      dispatch({ type: toggleLoadingAction.type });
      setSummaryDialogVisible(true);
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });
      console.log('[showSummaryList] err: ', err);
    }
  };

  useEffect(() => {
    console.log('fetch current semester: ', currentSemester);
    fetchListFailedStudentsBySemester(currentClass.id, currentSemester.semesterCode);
  }, [currentSemester]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
      <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100, marginBottom: 10 }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: appColor.textBlackColor,
            fontSize: 25,
          }}>
          Thống kê danh sách sinh viên rớt môn theo học kỳ
        </Text>
      </View>
      {/* Select semester popup */}
      <View>
        <Menu renderer={Popover}>
          <MenuTrigger>
            <Button
              mode="outlined"
              style={{ alignSelf: 'center', marginRight: 5, borderColor: appColor.primaryColor }}>
              {currentSemester.semester}
            </Button>
          </MenuTrigger>
          <MenuOptions>
            {semestersOfClass && semestersOfClass.length
              ? semestersOfClass.map((sm: ISemesterOfClass, index: number) => (
                  <MenuOption key={index} onSelect={() => onSelectSemesterOption(sm)}>
                    <Text>{sm.semester}</Text>
                  </MenuOption>
                ))
              : null}
          </MenuOptions>
        </Menu>
      </View>
      {/* List failed students */}
      <ScrollView style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100, marginVertical: 10 }}>
        {listFailedStudents && listFailedStudents.length
          ? listFailedStudents.map((student: IFailedStudentData, index: number) => (
              <FailedStudentItem key={index} failedStudent={student} />
            ))
          : null}
      </ScrollView>
      <View
        style={{
          marginHorizontal: (WINDOW_WIDTH * 5) / 100,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={styles.statisticSummaryContainer}>
          <View>
            <Text style={styles.statisticSummaryTitle}>Tổng số sinh viên rớt môn: </Text>
          </View>
          <View>
            <Text style={styles.statisticSummaryText}>{listFailedStudents.length} sinh viên</Text>
          </View>
        </View>
        {listFailedStudents.length ? (
          <View>
            <Button onPress={showSummaryList}>
              <Entypo
                style={{ backgroundColor: appColor.primaryColor }}
                name="list"
                size={25}
                color="#fff"
              />
            </Button>
          </View>
        ) : null}
      </View>

      <Portal>
        <Dialog visible={summaryDialogVisible} onDismiss={() => setSummaryDialogVisible(false)}>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10 }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                  Các môn có sinh viên rớt
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ flex: 8, alignSelf: 'stretch', ...styles.scoreItem }}>
                  <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>MMH</Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    alignSelf: 'stretch',
                    paddingHorizontal: 2,
                    ...styles.scoreItem,
                  }}>
                  <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Số SV</Text>
                </View>
              </View>
              <Divider />
              {Object.keys(summaryList).length
                ? Object.keys(summaryList).map((code: string) => (
                    <View
                      key={`mh-${code}`}
                      style={{
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{ flex: 8, alignSelf: 'stretch', ...styles.scoreItem }}>
                        <Text style={{ color: appColor.textBlackColor }}>
                          {summaryList[code].name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 2,
                          alignSelf: 'stretch',
                          paddingHorizontal: 2,
                          ...styles.scoreItem,
                        }}>
                        <Text style={{ color: appColor.textBlackColor, textAlign: 'right' }}>
                          {summaryList[code].count}
                        </Text>
                      </View>
                    </View>
                  ))
                : null}
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default StatisticFailedStudentBySemesterScreen;

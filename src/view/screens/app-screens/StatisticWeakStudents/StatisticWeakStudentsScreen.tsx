import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { Card } from 'react-native-elements';

import ScreenName from '../../../../common/constants/screen-name';
import { appColor } from '../../../styles/color';
import { WINDOW_WIDTH } from '../../../../config';
import styles from './styles';
import { selectCurrentClass } from '../../../../redux/state/class/slice';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../redux/state/global/saga-types';
import { statisticWeakStudentBySemester } from '../../../../redux/state/class-member/effects';
import { IWeakStudentData } from './interfaces';

const { Popover } = renderers;

interface ISemesterOfClass {
  semesterCode: string;
  semester: string;
}
const StatisticWeakStudentsScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const currentClass = useSelector(selectCurrentClass);
  console.log(
    '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 32  ▶️  StatisticFailedStudentBySemesterScreen  ▶️  currentClass',
    currentClass
  );
  const [semestersOfClass, setSemestersOfClass] = useState([] as ISemesterOfClass[]);
  const [listWeakStudents, setListWeakStudents] = useState([] as any[]);
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
  }, []);

  const onSelectSemesterOption = (semester: ISemesterOfClass) => {
    setCurrentSemester(semester);
  };

  const fetchListWeakStudentsBySemester = useCallback(
    async (classroomId: string, semesterCode: string) => {
      try {
        dispatch({ type: toggleLoadingAction.type });
        const result = await statisticWeakStudentBySemester(classroomId, semesterCode);
        const data = result?.data;
        console.log(
          '🔥🔥🔥  ▶️  file: StatisticWeakStudentsScreen.tsx  ▶️  line 103  ▶️  data',
          data
        );

        if (data) {
          setListWeakStudents(data);
        }
        dispatch({ type: toggleLoadingAction.type });
      } catch (err) {
        console.log(
          '🔥🔥🔥  ▶️  file: StatisticWeakStudentsScreen.tsx  ▶️  line 114  ▶️  err',
          err
        );

        dispatch({ type: toggleLoadingAction.type });
        dispatch({ type: setGlobalErrorAction.type, payload: { error: 'Có lỗi xảy ra' } });
      }
    },
    []
  );

  useEffect(() => {
    console.log('fetch current semester: ', currentSemester);
    fetchListWeakStudentsBySemester(currentClass.id, currentSemester.semesterCode);
  }, [currentSemester]);

  const renderStudentScoreItem = (key: string, titleText: string, contentText: string) => {
    return (
      <View key={key} style={{ flexDirection: 'row', marginVertical: 5 }}>
        <View>
          <Text style={{ color: appColor.textBlackColor, fontWeight: '700' }}>{titleText}</Text>
        </View>
        <View>
          <Text style={{ color: appColor.textBlackColor }}>{contentText}</Text>
        </View>
      </View>
    );
  };

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
          Thống kê danh sách sinh viên có điểm báo động theo học kỳ
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
      <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100, marginVertical: 10 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Mức điểm báo động (hệ 4):{' '}
          <Text style={{ color: 'red' }}>
            <FontAwesome5 name="less-than" /> {currentClass.settings?.lowScore}
          </Text>
        </Text>
      </View>
      <ScrollView>
        {listWeakStudents && listWeakStudents.length
          ? listWeakStudents.map((weakStudent: IWeakStudentData, index: number) => (
              <Card key={index}>
                <Card.Title>
                  {weakStudent.lastName} {weakStudent.firstName} - {weakStudent.sguId}
                </Card.Title>
                <Card.Divider />
                {renderStudentScoreItem(
                  `tenPointGradingAverageScore-${index}`,
                  'Điểm trung bình học kỳ hệ 10: ',
                  weakStudent.semesterScores[0].tenPointGradingAverageScore
                )}
                <View
                  key={`fourPointGradingAverageScore-${index}`}
                  style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <View>
                    <Text
                      style={{
                        color:
                          weakStudent.semesterScores &&
                          weakStudent.semesterScores.length &&
                          parseFloat(weakStudent.semesterScores[0].fourPointGradingAverageScore) <
                            1.5
                            ? 'red'
                            : appColor.textBlackColor,
                        fontWeight: '700',
                      }}>
                      Điểm trung bình học kỳ hệ 4:{' '}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color:
                          weakStudent.semesterScores &&
                          weakStudent.semesterScores.length &&
                          parseFloat(weakStudent.semesterScores[0].fourPointGradingAverageScore) <
                            1.5
                            ? 'red'
                            : appColor.textBlackColor,
                      }}>
                      {weakStudent.semesterScores[0].fourPointGradingAverageScore}
                    </Text>
                  </View>
                </View>
                {renderStudentScoreItem(
                  `cumulativeTenPointGradingAverageScore-${index}`,
                  'Điểm trung bình tích lũy hệ 10: ',
                  weakStudent.semesterScores[0].cumulativeTenPointGradingAverageScore
                )}
                <View
                  key={`cumulativeFourPointGradingAverageScore-${index}`}
                  style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <View>
                    <Text
                      style={{
                        color:
                          weakStudent.semesterScores &&
                          weakStudent.semesterScores.length &&
                          parseFloat(
                            weakStudent.semesterScores[0].cumulativeFourPointGradingAverageScore
                          ) < 1.5
                            ? 'red'
                            : appColor.textBlackColor,
                        fontWeight: '700',
                      }}>
                      Điểm trung bình tích lũy hệ 4:{' '}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color:
                          weakStudent.semesterScores &&
                          weakStudent.semesterScores.length &&
                          parseFloat(
                            weakStudent.semesterScores[0].cumulativeFourPointGradingAverageScore
                          ) < 1.5
                            ? 'red'
                            : appColor.textBlackColor,
                      }}>
                      {weakStudent.semesterScores[0].cumulativeFourPointGradingAverageScore}
                    </Text>
                  </View>
                </View>
                {renderStudentScoreItem(
                  `semesterCreditCount-${index}`,
                  'Số tín chỉ đạt: ',
                  weakStudent.semesterScores[0].semesterCreditCount.toString()
                )}
                {renderStudentScoreItem(
                  `cumulativeCreditCount-${index}`,
                  'Số tín chỉ tích lũy: ',
                  weakStudent.semesterScores[0].cumulativeCreditCount.toString()
                )}
              </Card>
            ))
          : null}
      </ScrollView>
      <View
        style={{
          marginHorizontal: (WINDOW_WIDTH * 5) / 100,
          padding: 5,
        }}>
        <View style={styles.statisticSummaryContainer}>
          <View>
            <Text style={styles.statisticSummaryTitle}>Tổng số sinh viên có điểm báo động: </Text>
          </View>
          <View>
            <Text style={styles.statisticSummaryText}>{listWeakStudents.length} sinh viên</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticWeakStudentsScreen;

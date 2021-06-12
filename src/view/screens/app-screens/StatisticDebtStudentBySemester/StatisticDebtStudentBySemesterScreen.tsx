import React, { useState, useEffect, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { statisticDebtStudentsOfClass } from '../../../../redux/state/class-member/effects';

const StatisticDebtStudentBySemester = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const currentClass = useSelector(selectCurrentClass);
  console.log(
    '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 32  ▶️  StatisticFailedStudentBySemesterScreen  ▶️  currentClass',
    currentClass
  );
  const [listDebtStudents, setListDebStudents] = useState([] as any[]);

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  const fetchListDebtStudents = useCallback(async (classroomId: string) => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      const result = await statisticDebtStudentsOfClass(classroomId);
      const data = result?.data;
      console.log(
        '🔥🔥🔥  ▶️  file: StatisticFailedStudentBySemesterScreen.tsx  ▶️  line 85  ▶️  fetchListFailedStudentsBySemester  ▶️  data',
        data
      );
      if (data) {
        console.log(
          '🔥🔥🔥  ▶️  file: StatisticDebtStudentBySemesterScreen.tsx  ▶️  line 45  ▶️  fetchListDebtStudents  ▶️  data',
          data
        );
        setListDebStudents(data);
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
  }, []);

  useEffect(() => {
    if (currentClass.id) {
      fetchListDebtStudents(currentClass.id);
    }
  }, []);

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
          Thống kê các sinh viên đang nợ học phí kỳ này
        </Text>
      </View>
      <ScrollView style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100, marginVertical: 10 }}>
        {listDebtStudents && listDebtStudents.length
          ? listDebtStudents.map((student: any, index: number) => (
              <Card key={index}>
                <Card.Title>
                  {student.lastName} {student.firstName} - {student.sguId}
                </Card.Title>
                <Card.Divider />
                <View key={`amount-${index}`} style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <View>
                    <Text style={{ fontWeight: '700' }}>Số tiền cần đóng: </Text>
                  </View>
                  <View>
                    <Text>
                      <NumberFormat
                        value={student.amount}
                        displayType={'text'}
                        thousandSeparator={true}
                        renderText={(value: any) => <Text>{value} VND</Text>}
                      />
                    </Text>
                  </View>
                </View>
                <View
                  key={`amountOwed-${index}`}
                  style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <View>
                    <Text style={{ color: 'red', fontWeight: '700' }}>Số tiền còn nợ: </Text>
                  </View>
                  <View>
                    <Text style={{ color: 'red' }}>
                      <NumberFormat
                        value={student.amountOwed}
                        displayType={'text'}
                        thousandSeparator={true}
                        renderText={(value: any) => <Text>{value} VND</Text>}
                      />
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          : null}
      </ScrollView>
      <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100 }}>
        <View style={styles.statisticSummaryContainer}>
          <View>
            <Text style={styles.statisticSummaryTitle}>Tổng số sinh viên nợ học phí: </Text>
          </View>
          <View>
            <Text style={styles.statisticSummaryText}>{listDebtStudents.length} sinh viên</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatisticDebtStudentBySemester;

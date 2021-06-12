import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { Button } from 'react-native-paper';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

import styles from './styles';
import { appColor } from '../../../styles/color';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import ScreenName from '../../../../common/constants/screen-name';
import {
  setGlobalErrorAction,
  toggleLoadingAction,
} from '../../../../redux/state/global/saga-types';
import { getStudentSchedule } from '../../../../redux/state/class-member/effects';
import { IScheduleData } from './interfaces';
import { WINDOW_WIDTH } from '../../../../config';

interface ISemesterData {
  semesterCode: string;
  semester: string;
}

interface IStartDateOfWeekData {
  startWeekDate: any;
  weekName: string;
  id: string;
}

const { Popover } = renderers;

const StudentTimeTableScren = ({ route, navigation }: { route: any; navigation: any }) => {
  const dispatch = useDispatch();

  const tableHead = ['Tiết', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const tableWithArr = [50, 100, 100, 100, 100, 100, 100, 100];

  const [schedules, setSchedules] = useState([] as any);
  const [listStartDatesOfEachWeek, setListStartDatesOfEachWeek] = useState(
    [] as IStartDateOfWeekData[]
  );
  const [currentStartDateOfWeek, setCurrentStartDateOfWeek] = useState({} as IStartDateOfWeekData);
  const [tableData, setTableData] = useState([] as any);
  const [currentYearSemesters, setCurrentYearSemesters] = useState([] as ISemesterData[]);
  const [currentSemester, setCurrentSemester] = useState({} as ISemesterData);

  const student = JSON.parse(route.params.member);

  const getColumnOfDayOfWeek = (dayOfWeek: string) => {
    switch (dayOfWeek) {
      case 'Hai':
        return 1;
      case 'Ba':
        return 2;
      case 'Tư':
        return 3;
      case 'Năm':
        return 4;
      case 'Sáu':
        return 5;
      case 'Bảy':
        return 6;
      case 'Chủ nhật':
        return 7;

      default:
        return 8;
    }
  };

  const generateTableData = (schedulesData: any[]) => {
    const data: any[] = [];

    for (let i = 0; i < 14; i++) {
      const rowData = [];
      for (let j = 0; j < 8; j++) {
        if (j === 0) {
          rowData.push({ value: `${i + 1}` });
        } else {
          rowData.push({});
        }
      }
      data.push(rowData);
    }

    schedulesData.forEach((schedule: IScheduleData) => {
      if (
        schedule.shiftCount &&
        schedule.startShift &&
        schedule.dayOfWeek &&
        schedule.subjectCode
      ) {
        const currentScheduleEndDateParams = schedule.endDate.split('/');
        const currentScheduleEndDateStr = `${currentScheduleEndDateParams[2]}-${currentScheduleEndDateParams[1]}-${currentScheduleEndDateParams[0]}`;

        if (
          currentStartDateOfWeek &&
          currentStartDateOfWeek.startWeekDate &&
          !currentStartDateOfWeek.startWeekDate.isAfter(
            moment(currentScheduleEndDateStr).startOf('day')
          )
        ) {
          const column = getColumnOfDayOfWeek(schedule.dayOfWeek);
          const row = parseInt(schedule.startShift) - 1;
          const shiftCount = parseInt(schedule.shiftCount);

          for (let i = 0; i < shiftCount; i++) {
            console.log('value: ', data[row + i][column].value);

            data[row + i][column] = {
              ...schedule,
              value: schedule.subjectName,
            };
          }
        }
      }
    });

    setTableData(data);
  };

  const generateListWeekOfCurrentSemester = (semesterStartDate: string) => {
    const startDateParams = semesterStartDate.split('/');
    const startDateStr = `${startDateParams[2]}-${startDateParams[1]}-${startDateParams[0]}`;

    const startDatesOfEachWeek: IStartDateOfWeekData[] = [
      {
        id: '1',
        startWeekDate: moment(startDateStr).startOf('day'),
        weekName: 'Tuần 1',
      },
    ];
    let currentStartDateOfWeek: IStartDateOfWeekData = startDatesOfEachWeek[0];

    /** 1 semester has 15 weeks, we have a date of first week so just generate 14 days left */
    for (let i = 2; i <= 19; i++) {
      startDatesOfEachWeek.push({
        id: `${i}`,
        startWeekDate: moment(startDateStr)
          .startOf('day')
          .add(i - 1, 'weeks'),
        weekName: `Tuần ${i}`,
      });
    }

    console.log('today: ', moment().startOf('day'));
    for (let i = 0; i < startDatesOfEachWeek.length; i++) {
      console.log('start date: ', startDatesOfEachWeek[i].startWeekDate);
      if (moment().startOf('day').isSame(startDatesOfEachWeek[i].startWeekDate)) {
        currentStartDateOfWeek = startDatesOfEachWeek[i];
        break;
      }

      if (i <= startDatesOfEachWeek.length - 2) {
        if (
          moment().startOf('day').isAfter(startDatesOfEachWeek[i].startWeekDate) &&
          moment()
            .startOf('day')
            .isBefore(startDatesOfEachWeek[i + 1].startWeekDate)
        ) {
          currentStartDateOfWeek = startDatesOfEachWeek[i];
          break;
        }
      }
    }

    console.log(
      '🔥🔥🔥  ▶️  file: StudentTimeTableScreen.tsx  ▶️  line 223  ▶️  generateListWeekOfCurrentSemester  ▶️  currentStartDateOfWeek',
      currentStartDateOfWeek
    );

    console.log(
      '🔥🔥🔥  ▶️  file: StudentTimeTableScreen.tsx  ▶️  line 195  ▶️  generateListWeekOfCurrentSemester  ▶️  startDatesOfEachWeek',
      startDatesOfEachWeek
    );
    setListStartDatesOfEachWeek(startDatesOfEachWeek);
    setCurrentStartDateOfWeek(currentStartDateOfWeek);
  };

  const fetchStudentSchedules = useCallback(async (semesterCode: string, sgudId: string) => {
    if (semesterCode && sgudId) {
      try {
        dispatch({ type: toggleLoadingAction.type });
        const result = await getStudentSchedule(semesterCode, sgudId);
        const data = result?.data;
        if (data) {
          setSchedules(data);
          if (data.length) {
            generateListWeekOfCurrentSemester(data[0].startDate);
          }
        }
        dispatch({ type: toggleLoadingAction.type });
      } catch (err) {
        console.log(
          '🔥🔥🔥  ▶️  file: StudentTimeTableScreen.tsx  ▶️  line 24  ▶️  fetchStudentSchedules  ▶️  err',
          err
        );
        dispatch({ type: setGlobalErrorAction.type });
        dispatch({ type: toggleLoadingAction.type });
      }
    }
  }, []);

  const generateListSemesterOfCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;

    let listSemesters: ISemesterData[];

    if (moment().isAfter(moment(currentDate).endOf('month'))) {
      /** Schedule is belong to this year */
      listSemesters = [
        {
          semesterCode: `${currentYear - 1}1`,
          semester: `Học kỳ 1 năm học ${currentYear} - ${currentYear + 1}`,
        },
        {
          semesterCode: `${currentYear - 1}2`,
          semester: `Học kỳ 2 năm học ${currentYear} - ${currentYear + 1}`,
        },
        {
          semesterCode: `${currentYear - 1}3`,
          semester: `Học kỳ hè năm học ${currentYear} - ${currentYear + 1}`,
        },
      ] as ISemesterData[];
    } else {
      /** Schedule is belong to last year */
      const year = currentYear - 1;
      listSemesters = [
        {
          semesterCode: `${year}3`,
          semester: `Học kỳ hè năm học ${year} - ${year + 1}`,
        },

        {
          semesterCode: `${year}2`,
          semester: `Học kỳ 2 năm học ${year} - ${year + 1}`,
        },
        {
          semesterCode: `${year}1`,
          semester: `Học kỳ 1 năm học ${year} - ${year + 1}`,
        },
      ] as ISemesterData[];
    }

    setCurrentYearSemesters(listSemesters);
    setCurrentSemester(listSemesters[0]);
  };

  useEffect(() => {
    generateListSemesterOfCurrentYear();
  }, []);

  useEffect(() => {
    generateTableData(schedules);
  }, [schedules, currentStartDateOfWeek]);

  useEffect(() => {
    if (currentSemester && currentSemester.semesterCode && student && student.sguId) {
      fetchStudentSchedules(currentSemester.semesterCode, student.sguId);
    }
  }, [currentSemester]);

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  const onSelectSemesterOption = (semester: ISemesterData) => {
    setCurrentSemester(semester);
  };

  const onNextWeek = (id: string) => {
    const currentWeekIndex = listStartDatesOfEachWeek.findIndex(
      (val: IStartDateOfWeekData) => val.id === id
    );

    if (currentWeekIndex === listStartDatesOfEachWeek.length - 1) {
      setCurrentStartDateOfWeek(listStartDatesOfEachWeek[currentWeekIndex]);
    }

    setCurrentStartDateOfWeek(listStartDatesOfEachWeek[currentWeekIndex + 1]);
  };

  const onPreWeek = (id: string) => {
    const currentWeekIndex = listStartDatesOfEachWeek.findIndex(
      (val: IStartDateOfWeekData) => val.id === id
    );

    if (currentWeekIndex === 0) {
      setCurrentStartDateOfWeek(listStartDatesOfEachWeek[currentWeekIndex]);
    }

    setCurrentStartDateOfWeek(listStartDatesOfEachWeek[currentWeekIndex - 1]);
  };

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
      <View style={{ paddingVertical: 5, paddingHorizontal: 10, marginVertical: 5 }}>
        <Text
          style={{
            color: appColor.textBlackColor,
            fontSize: 25,
            textAlign: 'center',
            fontWeight: '700',
          }}>
          Thời khóa biểu của sinh viên &quot;{student.lastName} {student.firstName}&quot;
        </Text>
      </View>
      {/* Select semester popup */}
      <View style={{ marginVertical: 5 }}>
        <Menu renderer={Popover}>
          <MenuTrigger>
            <Button
              mode="outlined"
              style={{ alignSelf: 'center', marginRight: 5, borderColor: appColor.primaryColor }}>
              {currentSemester.semester}
            </Button>
          </MenuTrigger>
          <MenuOptions>
            {currentYearSemesters && currentYearSemesters.length
              ? currentYearSemesters.map((sm: ISemesterData, index: number) => (
                  <MenuOption key={index} onSelect={() => onSelectSemesterOption(sm)}>
                    <Text>{sm.semester}</Text>
                  </MenuOption>
                ))
              : null}
          </MenuOptions>
        </Menu>
      </View>
      {/* Calendar zone */}
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row
              data={tableHead}
              widthArr={tableWithArr}
              style={styles.header}
              textStyle={{ color: '#fff', textAlign: 'center' }}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              {tableData.map((rowData: any[], index: number) => (
                <TableWrapper key={index} style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      width={cellIndex === 0 ? 50 : 100}
                      key={cellIndex}
                      style={{
                        backgroundColor:
                          cellIndex === 0
                            ? appColor.primaryColor
                            : cellData.subjectCode
                            ? '#f0f0f0'
                            : '#fff',
                      }}
                      data={cellData.value}
                      textStyle={{
                        color: cellData.subjectCode ? 'black' : '#fff',
                        textAlign: 'center',
                        fontWeight: '100',
                        padding: 10,
                      }}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      <View>
        <View
          style={{
            marginHorizontal: (WINDOW_WIDTH * 5) / 100,
            paddingVertical: 5,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View>
            <TouchableOpacity
              disabled={currentStartDateOfWeek.id === '1'}
              onPress={() => onPreWeek(currentStartDateOfWeek.id)}>
              <Text style={styles.changeWeekButton}>
                <AntDesignIcon name="arrowleft" /> Tuần trước
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>{currentStartDateOfWeek.weekName}</Text>
          </View>
          <View>
            <TouchableOpacity
              disabled={currentStartDateOfWeek.id === '19'}
              onPress={() => onNextWeek(currentStartDateOfWeek.id)}>
              <Text style={styles.changeWeekButton}>
                Tuần sau <AntDesignIcon name="arrowright" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentTimeTableScren;

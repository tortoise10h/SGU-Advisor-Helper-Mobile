import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { getStudentScore } from '../../../../redux/state/class-member/effects';
import { Button } from 'react-native-paper';
import AntDesingIcon from 'react-native-vector-icons/AntDesign';
import _ from 'lodash';
import { Divider } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { appColor } from '../../../styles/color';
import { WINDOW_WIDTH } from '../../../../config';
import { IStudentScoreData, IStudentScoreItem } from './interfaces';
import { toggleLoadingAction } from '../../../../redux/state/global/saga-types';
import { EXCEPT_SUBJECT_CODES, WARNING_GRADE_CHAR } from '../../../../common/constants/user';
import ScreenName from '../../../../common/constants/screen-name';

const { Popover } = renderers;

const StudentScoreScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const dispatch = useDispatch();

  const student = JSON.parse(route.params.member);

  const [studentSemesterScores, setStudentScores] = useState([] as any);
  const [currentSemester, setCurrentSemester] = useState({} as any);
  console.log(
    '🔥🔥🔥  ▶️  file: StudentScoreScreen.tsx  ▶️  line 24  ▶️  StudentScoreScreen  ▶️  currentSemester',
    currentSemester
  );

  const getSemesterFromSemesterCode = (semesterCode: string) => {
    const year = parseInt(semesterCode.substr(0, 4));
    const semesterNum = parseInt(semesterCode.substr(semesterCode.length - 1, 1));
    const semesterStr = semesterNum === 3 ? 'hè' : semesterNum;

    const result = `Học kỳ ${semesterStr} năm học ${year} - ${year + 1}`;
    return result;
  };

  const prepareDataForShow = (data: IStudentScoreData[]) => {
    if (data && data.length) {
      let finalData = data.map((value: IStudentScoreData) => {
        return {
          ...value,
          semester: getSemesterFromSemesterCode(value.semesterCode),
          semesterCodeNum: parseInt(value.semesterCode),
        };
      });

      finalData = _.orderBy(finalData, ['semesterCodeNum'], ['desc']);

      return finalData;
    }

    return data;
  };

  const fetchStudentScore = useCallback(async () => {
    try {
      dispatch({ type: toggleLoadingAction.type });
      const result = await getStudentScore(student.sguId);
      let data = result?.data;
      console.log(
        '🔥🔥🔥  ▶️  file: StudentScoreScreen.tsx  ▶️  line 65  ▶️  fetchStudentScore  ▶️  data',
        data
      );
      data = prepareDataForShow(data);
      console.log(
        '🔥🔥🔥  ▶️  file: StudentScoreScreen.tsx  ▶️  line 14  ▶️  fetchStudentScore  ▶️  data',
        data
      );
      if (data && data.length) {
        setStudentScores(data);
        setCurrentSemester(data[0]);
      } else {
        setStudentScores([]);
        setCurrentSemester({});
      }
      dispatch({ type: toggleLoadingAction.type });
    } catch (err) {
      dispatch({ type: toggleLoadingAction.type });
      console.log(
        '🔥🔥🔥  ▶️  file: StudentScoreScreen.tsx  ▶️  line 37  ▶️  fetchStudentScore  ▶️  err',
        err
      );
    }
  }, []);

  useEffect(() => {
    fetchStudentScore();
  }, []);

  const onSelectChangeSemester = (scoreData: IStudentScoreData) => {
    setCurrentSemester(scoreData);
  };

  const getMainPreviousSemester = (currentSemester: IStudentScoreData) => {
    const currentSemesterIndex = studentSemesterScores.findIndex(
      (val: any) => val.semesterCode === currentSemester.semesterCode
    );
    console.log(
      '🔥🔥🔥  ▶️  file: StudentScoreScreen.tsx  ▶️  line 64  ▶️  getPreviousSemester  ▶️  currentSemesterIndex',
      currentSemesterIndex
    );

    if (currentSemesterIndex === studentSemesterScores.length - 1) {
      return null;
    }

    console.log(
      '🔥🔥🔥  ▶️  file: StudentScoreScreen.tsx  ▶️  line 75  ▶️  getPreviousSemester  ▶️  tudentSemesterScores[currentSemesterIndex - 1]',
      studentSemesterScores[currentSemesterIndex + 1]
    );
    const previousSemester = studentSemesterScores[currentSemesterIndex + 1];
    if (!previousSemester.tenPointGradingAverageScore) {
      return studentSemesterScores[currentSemesterIndex + 2];
    }

    return previousSemester;
  };

  const renderSummaryScore = (
    key: string,
    currentScoreStr: string,
    previousSemesterScoreStr?: string
  ) => {
    const currentScore = parseFloat(currentScoreStr);
    if (!isNaN(currentScore)) {
      let scoreChanged = null as any;
      let color = 'black';
      let icon = 'arrowup';
      if (previousSemesterScoreStr) {
        const previousSemesterScore = parseFloat(previousSemesterScoreStr);
        scoreChanged = currentScore - previousSemesterScore;
        scoreChanged = scoreChanged.toFixed(2);

        if (scoreChanged >= 0) {
          color = 'green';
        } else {
          color = 'red';
          icon = 'arrowdown';
        }
      }

      return (
        <Text key={key}>
          {currentScore}
          {'  '}
          {scoreChanged ? (
            <>
              <AntDesingIcon name={icon} color={color} />{' '}
              <Text style={{ color }}>{scoreChanged}</Text>
            </>
          ) : null}
        </Text>
      );
    }

    return null;
  };

  const renderScoreItem = (score: IStudentScoreItem, index: number) => {
    const color =
      score.tenPointGrading !== null
        ? score.passed
          ? appColor.textBlackColor
          : EXCEPT_SUBJECT_CODES.includes(score.subject.code)
          ? appColor.textBlackColor
          : 'red'
        : appColor.textBlackColor;

    return (
      <>
        <View
          key={index}
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
          <View
            key={`subjectCode-${index}`}
            style={{ flex: 2, alignSelf: 'stretch', ...styles.scoreItem }}>
            <Text style={{ color }}>
              {score.subject.code}{' '}
              {score.classGrading === WARNING_GRADE_CHAR ? (
                <AntDesingIcon name="warning" color="orange" />
              ) : null}
            </Text>
          </View>
          <View
            key={`subjectName-${index}`}
            style={{
              flex: 5,
              alignSelf: 'stretch',
              paddingHorizontal: 5,
              ...styles.scoreItem,
            }}>
            <Text style={{ color }}>{score.subject.name}</Text>
          </View>
          <View
            key={`tenPointGrading-${index}`}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              paddingHorizontal: 2,
              ...styles.scoreItem,
            }}>
            <Text style={{ color }}>{score.tenPointGrading}</Text>
          </View>
          <View
            key={`fourPointGrading-${index}`}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              paddingHorizontal: 2,
              ...styles.scoreItem,
            }}>
            <Text style={{ color }}>{score.fourPointGrading}</Text>
          </View>
          <View
            key={`classGrading-${index}`}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              paddingHorizontal: 2,
              ...styles.scoreItem,
            }}>
            <Text style={{ color }}>{score.classGrading}</Text>
          </View>
        </View>
        <Divider key={`divider-${index}`} />
      </>
    );
  };

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={navigateToClassMemberScreen}>
          <AntDesingIcon
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
          Điểm theo học kỳ của sinh viên &quot;{student.lastName} {student.firstName}&quot;
        </Text>
      </View>
      <View style={{ marginVertical: 10 }}>
        <Menu renderer={Popover}>
          <MenuTrigger>
            <Button
              mode="outlined"
              style={{ alignSelf: 'center', marginRight: 5, borderColor: appColor.primaryColor }}>
              {currentSemester.semester}
            </Button>
          </MenuTrigger>
          <MenuOptions>
            {studentSemesterScores.length
              ? studentSemesterScores.map((scoreData: IStudentScoreData, index: number) => (
                  <MenuOption key={index} onSelect={() => onSelectChangeSemester(scoreData)}>
                    <Text>{scoreData.semester}</Text>
                  </MenuOption>
                ))
              : null}
          </MenuOptions>
        </Menu>
      </View>
      <ScrollView>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
          <View style={{ flex: 2, alignSelf: 'stretch', ...styles.scoreItem }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>MMH</Text>
          </View>
          <View style={{ flex: 5, alignSelf: 'stretch', ...styles.scoreItem }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Môn</Text>
          </View>
          <View
            style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 2, ...styles.scoreItem }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Điểm (10)</Text>
          </View>
          <View
            style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 2, ...styles.scoreItem }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Điểm (4)</Text>
          </View>
          <View
            style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 2, ...styles.scoreItem }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Điểm</Text>
          </View>
        </View>
        <Divider />
        {currentSemester && currentSemester.scores && currentSemester.scores.length
          ? currentSemester.scores.map((score: IStudentScoreItem, index: number) =>
              renderScoreItem(score, index)
            )
          : null}
        <View style={{ marginVertical: 10 }}>
          {currentSemester.tenPointGradingAverageScore ? (
            <View style={styles.semesterSummaryContainer}>
              <View>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>
                  Điểm trung bình học kỳ hệ 10/100:
                </Text>
              </View>
              <View>
                <Text>
                  {renderSummaryScore(
                    'tenPointGradingAverageScore',
                    currentSemester.tenPointGradingAverageScore,
                    getMainPreviousSemester(currentSemester)?.tenPointGradingAverageScore
                  )}
                </Text>
              </View>
            </View>
          ) : null}
          {currentSemester.fourPointGradingAverageScore ? (
            <View style={styles.semesterSummaryContainer}>
              <View>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>
                  Điểm trung bình học kỳ hệ 4:
                </Text>
              </View>
              <View>
                <Text>
                  {renderSummaryScore(
                    'fourPointGradingAverageScore',
                    currentSemester.fourPointGradingAverageScore,
                    getMainPreviousSemester(currentSemester)?.fourPointGradingAverageScore
                  )}
                </Text>
              </View>
            </View>
          ) : null}
          {currentSemester.cumulativeTenPointGradingAverageScore ? (
            <View style={styles.semesterSummaryContainer}>
              <View>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>
                  Điểm trung bình tích lũy:
                </Text>
              </View>
              <View>
                <Text>
                  {renderSummaryScore(
                    'cumulativeTenPointGradingAverageScore',
                    currentSemester.cumulativeTenPointGradingAverageScore,
                    getMainPreviousSemester(currentSemester)?.cumulativeTenPointGradingAverageScore
                  )}
                </Text>
              </View>
            </View>
          ) : null}
          {currentSemester.cumulativeFourPointGradingAverageScore ? (
            <View style={styles.semesterSummaryContainer}>
              <View>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>
                  Điểm trung bình tích lũy (hệ 4):
                </Text>
              </View>
              <View>
                <Text>
                  {renderSummaryScore(
                    'cumulativeFourPointGradingAverageScore',
                    currentSemester.cumulativeFourPointGradingAverageScore,
                    getMainPreviousSemester(currentSemester)?.cumulativeFourPointGradingAverageScore
                  )}
                </Text>
              </View>
            </View>
          ) : null}
          {currentSemester.semesterCreditCount ? (
            <View
              style={{
                ...styles.semesterSummaryContainer,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <View>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>Số tín chỉ đạt:</Text>
              </View>
              <View>
                <Text>{currentSemester.semesterCreditCount} </Text>
              </View>
              <View style={{ alignSelf: 'center' }}>
                <AntDesingIcon name="arrowright" />
              </View>
              <View>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>Tổng số tín chỉ:</Text>
              </View>
              <View>
                <Text>{currentSemester.cumulativeCreditCount}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentScoreScreen;

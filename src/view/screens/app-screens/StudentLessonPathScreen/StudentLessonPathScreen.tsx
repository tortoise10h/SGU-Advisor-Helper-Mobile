import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenName from '../../../../common/constants/screen-name';
import { appColor } from '../../../styles/color';
import { WINDOW_WIDTH } from '../../../../config';
import styles from './styles';
import {setGlobalErrorAction, toggleLoadingAction} from '../../../../redux/state/global/saga-types';
import {getLessonPath} from '../../../../redux/state/class-member/effects';
import {ILessonData, LessonStatus} from './interfaces';
import LessonItem from './components/LessonItem';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

const { Popover } = renderers;

enum FilterOption {
  All = 'all',
  Failed = 'failed',
  Remain = 'remain',
}

const StudentLessonPathScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const dispatch = useDispatch();
  const student = JSON.parse(route.params.member);

  const [lessons, setLessons] = useState([] as ILessonData[]);
  const [failedLessons, setFailedLessons] = useState([] as ILessonData[]);
  const [remainLessons, setRemainLessons] = useState([] as ILessonData[]);
  const [totalLessonStudied, setTotalLessonStudied] = useState(0);
  const [totalCreditCount, setTotalCreditCount] = useState(0);
  const [currentFilter, setCurrentFilter] = useState(FilterOption.All);

  const navigateToClassMemberScreen = () => {
    navigation.navigate(ScreenName.PROFESSOR_CLASS_MEMBERS_SCREEN);
  };

  const fetchLessonPath = useCallback(
    async () => {
      try {
        dispatch({ type: toggleLoadingAction.type });
        const result = await getLessonPath(student.id);
        const data = result?.data;
        console.log('[fetchLessonPath] data: ', data);
        if (data) {
          const studiedLessons: ILessonData[] = [];
          const failedLessons: ILessonData[] = [];
          const remainLessons: ILessonData[] = [];
          data.forEach((lesson: ILessonData) => {
            if (lesson.status !== LessonStatus.Studying && lesson.status !== LessonStatus.UnStudied) {
              studiedLessons.push(lesson);
            } else {
              remainLessons.push(lesson);
            }

            if (lesson.status === LessonStatus.Failed) {
              failedLessons.push(lesson);
            }
          });
          const creditsCount = data.reduce((total: number, lesson: ILessonData) => {
            if (lesson.status === LessonStatus.Passed) {
              total += lesson.creditCount;
            }

            return total;
          }, 0);

          setLessons(data);
          setFailedLessons(failedLessons);
          setRemainLessons(remainLessons);
          setTotalLessonStudied(studiedLessons.length);
          setTotalCreditCount(creditsCount);
        }
        dispatch({ type: toggleLoadingAction.type });
      } catch (err) {
        console.log('[fetchLessonPath] err: ', err);
        dispatch({ type: toggleLoadingAction.type });
        dispatch({ type: setGlobalErrorAction.type, payload: { error: 'Có lỗi xảy ra' } });
      }
    },
    []
  );

  const renderFilterOptionName = (filterOption: FilterOption) => {
    switch (filterOption) {
      case FilterOption.All: {
        return 'Tất cả';
      }
      case FilterOption.Remain: {
        return 'Còn lại';
      }
      case FilterOption.Failed: {
        return 'Cần học lại';
      }
    }
  };

  const renderLessonPath = () => {
    let lessonsData: ILessonData[] = [];
    switch (currentFilter) {
      case FilterOption.Failed: {
        lessonsData = failedLessons;
        break;
      }
      case FilterOption.All: {
        lessonsData = lessons;
        break;
      }
      case FilterOption.Remain: {
        lessonsData = remainLessons;
        break;
      }
    }

    return (
      <>
        {lessonsData.length
          ? lessonsData.map((lesson: ILessonData, index: number) => (
              <LessonItem key={`lesson-item-${index}`} lesson={lesson} />
            ))
          : null}
      </>
    );
  };

  const onSelectFilter = (filterOption: FilterOption) => {
    setCurrentFilter(filterOption);
  };

  useEffect(() => {
    fetchLessonPath();
  }, []);

  const renderSummaryItem = (title: string, content: string) => {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        <View>
          <Text style={styles.summaryItemTitle}>{title} </Text>
        </View>
        <View>
          <Text>{content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={navigateToClassMemberScreen}>
          <AntDesignIcon
            style={{ marginLeft: 5, padding: 5 }}
            name="arrowleft"
            size={25}
            color={appColor.hardPrimaryColor}
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: (WINDOW_WIDTH * 5) / 100, marginTop: 5 }}>
        <Text
          style={{
            color: appColor.textBlackColor,
            fontSize: 25,
            textAlign: 'center',
            fontWeight: '700',
          }}>
          Lộ trình môn học của sinh viên &quot;{student.lastName} {student.firstName}&quot;
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
            marginVertical: 5,
          }}>
          {/* Table header */}
          <View style={{ flex: 2, alignSelf: 'stretch' }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>MMH</Text>
          </View>
          <View style={{ flex: 4, alignSelf: 'stretch' }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Môn</Text>
          </View>
          <View style={{ flex: 2, alignSelf: 'stretch', paddingHorizontal: 2 }}>
            <Text
              style={{ fontWeight: 'bold', color: appColor.textBlackColor, textAlign: 'center' }}>
              Số TC
            </Text>
          </View>
          <View style={{ flex: 2, alignSelf: 'stretch', paddingHorizontal: 2 }}>
            <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Tình trạng</Text>
          </View>
        </View>
        <Divider />
        {/* Table body */}
        {renderLessonPath()}
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          {renderSummaryItem('Số môn đã học:', `${totalLessonStudied}/${lessons.length}`)}
          {renderSummaryItem('Số tín chỉ đạt được:', `${totalCreditCount}`)}
          {renderSummaryItem('Số môn cần học lại:', `${failedLessons.length}`)}
        </View>
        <View>
          <Menu renderer={Popover}>
            <MenuTrigger>
              <View>
                <Button
                  mode="contained"
                  style={{ backgroundColor: '#fff' }}
                  labelStyle={{ color: appColor.textBlackColor }}>
                  {renderFilterOptionName(currentFilter)}
                </Button>
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => onSelectFilter(FilterOption.All)} text="Tất cả" />
              <MenuOption onSelect={() => onSelectFilter(FilterOption.Remain)} text="Còn lại" />
              <MenuOption onSelect={() => onSelectFilter(FilterOption.Failed)} text="Cần học lại" />
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentLessonPathScreen;

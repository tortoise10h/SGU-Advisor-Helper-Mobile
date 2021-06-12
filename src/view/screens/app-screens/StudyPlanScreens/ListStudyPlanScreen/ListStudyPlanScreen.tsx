import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { selectCurrentClass } from '../../../../../redux/state/class/slice';
import { Button, Dialog, Portal } from 'react-native-paper';
import {
  selectStudyPlanLastChangedAt,
  selectStudyPlans,
} from '../../../../../redux/state/study-plan/slice';
import {
  deleteStudyPlanSagaAction,
  fetchStudyPlansSagaAction,
} from '../../../../../redux/state/study-plan/saga-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

import styles from './styles';
import { IStudyPlanData } from './interfaces';
import { WINDOW_WIDTH } from '../../../../../config';
import FloatingCreateButton from '../../FeedScreen/componennts/FloatingCreateButton';
import { selectCurrentMemberShip } from '../../../../../redux/state/user/slice';
import { ClassCorePositions } from '../../../../../common/constants/user';
import { appColor } from '../../../../styles/color';
import ScreenName from '../../../../../common/constants/screen-name';

const { SlideInMenu, Popover } = renderers;

const ListStudyPlanScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const [selectedStudentPlan, setSelectedStudyPlan] = useState(null as any);
  const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] = useState(false);
  const [currentDateFilter, setCurrentDateFilter] = useState('Tất cả');
  const [yearsOptions, setYearOptions] = useState({} as any);

  const selectStudyPlanMenuRef = useRef(null as any);

  const currentClass = useSelector(selectCurrentClass);
  const currentMembership = useSelector((state: any) =>
    selectCurrentMemberShip(state, currentClass.id)
  );
  const studyPlans = useSelector(selectStudyPlans);
  console.log(
    '🔥🔥🔥  ▶️  file: ListStudyPlanScreen.tsx  ▶️  line 17  ▶️  ListStudyPlanScreen  ▶️  studyPlans',
    studyPlans
  );
  const studyPlanChangedAt = useSelector(selectStudyPlanLastChangedAt);

  const data = studyPlans.map((studyPlan: IStudyPlanData) => {
    return {
      title: studyPlan.title,
      time: moment(studyPlan.time).format('DD/MM/YYYY'),
      pureTime: studyPlan.time,
      description: studyPlan.description,
      id: studyPlan.id,
    };
  });

  useEffect(() => {
    if (currentClass.id) {
      dispatch({ type: fetchStudyPlansSagaAction.type, payload: { classroomId: currentClass.id } });
    }
  }, [studyPlanChangedAt, currentClass]);

  useEffect(() => {
    if (currentDateFilter === 'Tất cả') {
      const yearsObj: any = {};

      studyPlans.forEach((studyPlan: IStudyPlanData) => {
        yearsObj[moment(studyPlan.time).year().toString()] = true;
      });
      setYearOptions(yearsObj);
    }
  }, [studyPlans]);

  const onPressEvent = async (e: any) => {
    if (currentMembership && ClassCorePositions.includes(currentMembership.position)) {
      await selectStudyPlanMenuRef?.current.open();
      setSelectedStudyPlan(e);
    }
  };

  const hideConfirmDeleteDialog = () => {
    setConfirmDeleteDialogVisible(false);
  };

  const openConfirmDeleteDialog = () => {
    setConfirmDeleteDialogVisible(true);
  };

  const onSelectDeleteEvent = async () => {
    await selectStudyPlanMenuRef?.current.close();
    openConfirmDeleteDialog();
  };

  const handleDeleteStudyPlan = () => {
    dispatch({
      type: deleteStudyPlanSagaAction.type,
      payload: { classroomId: currentClass.id, studyPlanId: selectedStudentPlan.id },
    });
    hideConfirmDeleteDialog();
  };

  const navigateToEditScreen = () => {
    const selectedFeedStringify = JSON.stringify(selectedStudentPlan);
    navigation.navigate(ScreenName.UPDATE_STUDY_PLAN_SCREEN, {
      feed: selectedFeedStringify,
    });
  };

  const onSelectFilterDate = (startDate: any, endDate?: any) => {
    if (startDate) {
      const filter: any = {};
      const filterCondition: any = {};

      if (endDate) {
        setCurrentDateFilter(`Năm ${moment(startDate).year()}`);
        filter.time = [startDate, endDate];
        filterCondition.time = 'between';
      } else {
        setCurrentDateFilter('Bắt đầu từ hôm nay');
        filter.time = startDate;
        filterCondition.time = '>=';
      }

      dispatch({
        type: fetchStudyPlansSagaAction.type,
        payload: { classroomId: currentClass.id, filter, filterCondition },
      });
    } else {
      setCurrentDateFilter('Tất cả');
      dispatch({ type: fetchStudyPlansSagaAction.type, payload: { classroomId: currentClass.id } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginHorizontal: (WINDOW_WIDTH * 5) / 100,
          marginTop: 5,
        }}>
        <View>
          <Menu renderer={Popover}>
            <MenuTrigger>
              <View>
                <Button
                  mode="contained"
                  style={{ backgroundColor: '#fff' }}
                  labelStyle={{ color: appColor.textBlackColor }}>
                  {currentDateFilter}
                </Button>
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => onSelectFilterDate(null)} text="Tất cả" />
              <MenuOption
                onSelect={() => onSelectFilterDate(moment().startOf('day').toISOString())}
                text="Bắt đầu từ hôm nay"
              />
              {Object.keys(yearsOptions).length
                ? Object.keys(yearsOptions).map((key: string, index: number) => (
                    <MenuOption
                      key={`filter-item-${index}`}
                      onSelect={() =>
                        onSelectFilterDate(
                          moment(`${key}-01-01`).startOf('day').toISOString(),
                          moment(`${key}-12-31`).startOf('day').toISOString()
                        )
                      }
                      text={`Năm ${key}`}
                    />
                  ))
                : null}
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View style={{ flex: 1, marginHorizontal: (WINDOW_WIDTH * 5) / 100, marginTop: 5 }}>
        <Timeline
          onEventPress={(e: any) => onPressEvent(e)}
          lineColor={appColor.primaryColor}
          timeStyle={{
            fontSize: 11,
            backgroundColor: appColor.primaryColor,
            paddingVertical: 2,
            paddingHorizontal: 5,
            borderRadius: 20,
            color: '#fff',
          }}
          circleSize={20}
          circleColor={appColor.primaryColor}
          innerCircle={'dot'}
          data={data}
        />

        <Menu ref={selectStudyPlanMenuRef} renderer={SlideInMenu}>
          <MenuTrigger text="" />
          <MenuOptions>
            <MenuOption
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}
              onSelect={navigateToEditScreen}>
              <View>
                <Fontawesome name="edit" size={15} />
              </View>
              <View>
                <Text style={{ paddingHorizontal: 10, paddingVertical: 5 }}>Chỉnh sửa</Text>
              </View>
            </MenuOption>
            <MenuOption
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}
              onSelect={onSelectDeleteEvent}>
              <View>
                <Fontawesome name="trash-o" size={15} />
              </View>
              <View>
                <Text style={{ paddingHorizontal: 10, paddingVertical: 5 }}>Xóa</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <Portal>
          <Dialog visible={confirmDeleteDialogVisible} onDismiss={hideConfirmDeleteDialog}>
            <Dialog.Title>Bạn có chắc muốn xóa kế hoạch học tập này hay không?</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={hideConfirmDeleteDialog}>Không</Button>
              <Button onPress={handleDeleteStudyPlan}>Có</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      {currentMembership && ClassCorePositions.includes(currentMembership.position) ? (
        <FloatingCreateButton navigation={navigation} />
      ) : null}
    </SafeAreaView>
  );
};

export default ListStudyPlanScreen;

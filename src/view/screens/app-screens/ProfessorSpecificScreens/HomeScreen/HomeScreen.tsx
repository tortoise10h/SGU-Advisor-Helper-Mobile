import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import _ from 'lodash';

import styles from './style';
import AppHeaderText from '../../../../components/common/AppBarWithDrawerToggle/AppHeaderText';
import ClassItem from './components/ClassItem';
import {
  fetchMyClassesSagaAction,
  setCurrentClassSagaAction,
} from '../../../../../redux/state/class/saga-types';
import { selectMyClasses } from '../../../../../redux/state/class/slice';
import ScreenName from '../../../../../common/constants/screen-name';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [randNumFetchClasses, setRandNumFetchclasses] = useState(1);
  const dispatch = useDispatch();
  const myClasses = useSelector(selectMyClasses);

  const classesGroupedBySchoolYear = _.groupBy(
    myClasses.map((c: any) => {
      return {
        ...c,
        schoolYear: `${c.schoolYearStart} - ${c.schoolYearEnd}`,
      };
    }),
    'schoolYear'
  );

  const navigateToProfessorTabStack = (classId: string, data: any) => {
    console.log('[navigateToProfessorTabStack] should navigate ');
    const selectedClass = myClasses.find((myClass: any) => myClass.id === classId);
    console.log('[navigateToProfessorTabStack] selectedClass: ', selectedClass);
    dispatch(setCurrentClassSagaAction(selectedClass));
    navigation.navigate(ScreenName.PROFESSOR_TAB_STACK, {
      classId,
      ...data,
    });
  };

  useEffect(() => {
    dispatch(fetchMyClassesSagaAction(null));
  }, [randNumFetchClasses]);

  const handleRefreshClasses = () => {
    setRandNumFetchclasses(Math.random());
  };

  const renderClassGroup = (classes: any[], groupSchoolYear: string, key: number | string) => {
    return (
      <View key={key}>
        <Text style={styles.listTitle}>Khóa {groupSchoolYear}</Text>
        {classes.map((classData: any) => (
          <ClassItem
            navigate={navigateToProfessorTabStack}
            classData={classData}
            key={classData.id.toString()}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Appbar.Header style={{ backgroundColor: '#fff', marginBottom: 10 }}>
          <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
          <Appbar.Content
            title={<AppHeaderText text="SGU Adviser Helper" customStyle={{ color: '#404043' }} />}
            style={{ marginLeft: 5 }}
          />
          <Appbar.Action onPress={handleRefreshClasses} icon="reload" />
        </Appbar.Header>
      </View>

      <View style={styles.body}>
        <ScrollView>
          {Object.keys(classesGroupedBySchoolYear).length
            ? Object.keys(classesGroupedBySchoolYear).map((key: string, index: number) =>
                renderClassGroup(classesGroupedBySchoolYear[key], key, index)
              )
            : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

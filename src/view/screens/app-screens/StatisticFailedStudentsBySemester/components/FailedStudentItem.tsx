import React from 'react';
import { View, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { appColor } from '../../../../styles/color';
import { IFailedStudentData, IFailedStudentSubjectItem } from '../interfaces';
import styles from '../styles';

const FailedStudentItem = ({ failedStudent }: { failedStudent: IFailedStudentData }) => {
  return (
    <View style={{ marginVertical: 20 }}>
      <View>
        <Text style={{ fontWeight: '700', color: appColor.textBlackColor, fontSize: 15 }}>
          <FontAwesome5 name="dot-circle" size={15} />
          {'  '}
          {failedStudent.lastName} {failedStudent.firstName} - {failedStudent.sguId}{' '}
          <Text style={{ color: 'red' }}>({failedStudent.subjectScores.length} môn)</Text>
        </Text>
      </View>
      {/* Student failed subject table header */}
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
        <View style={{ flex: 4, alignSelf: 'stretch', ...styles.scoreItem }}>
          <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Môn</Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 2, ...styles.scoreItem }}>
          <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Điểm (10)</Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 2, ...styles.scoreItem }}>
          <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Điểm (4)</Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 2, ...styles.scoreItem }}>
          <Text style={{ fontWeight: 'bold', color: appColor.textBlackColor }}>Điểm TK</Text>
        </View>
      </View>
      <Divider />

      {/* Student failed subject table data */}
      {failedStudent.subjectScores && failedStudent.subjectScores.length
        ? failedStudent.subjectScores.map(
            (subjectScore: IFailedStudentSubjectItem, index: number) => (
              <>
                <View
                  key={index}
                  style={{
                    alignSelf: 'stretch',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <View style={{ flex: 2, alignSelf: 'stretch', ...styles.scoreItem }}>
                    <Text style={{ color: appColor.textBlackColor }}>
                      {subjectScore.subject.code}
                    </Text>
                  </View>
                  <View style={{ flex: 4, alignSelf: 'stretch', ...styles.scoreItem }}>
                    <Text style={{ color: appColor.textBlackColor }}>
                      {subjectScore.subject.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch',
                      paddingHorizontal: 2,
                      ...styles.scoreItem,
                    }}>
                    <Text style={{ color: appColor.textBlackColor }}>
                      {subjectScore.tenPointGrading}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch',
                      paddingHorizontal: 2,
                      ...styles.scoreItem,
                    }}>
                    <Text style={{ color: appColor.textBlackColor }}>
                      {subjectScore.fourPointGrading}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch',
                      paddingHorizontal: 2,
                      ...styles.scoreItem,
                    }}>
                    <Text style={{ color: appColor.textBlackColor }}>
                      {subjectScore.classGrading}
                    </Text>
                  </View>
                </View>
                <Divider key={`divider-${index}`} />
              </>
            )
          )
        : null}
    </View>
  );
};

export default FailedStudentItem;

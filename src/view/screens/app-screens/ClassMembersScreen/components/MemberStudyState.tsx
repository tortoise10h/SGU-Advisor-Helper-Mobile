import React from 'react';
import { ListItem } from 'react-native-elements';
import { convertStudentStudyState, StudentStudyState } from '../../../../../common/constants/user';

const MemberStudyState = ({ studyState }: { studyState: string }) => {
  const color = studyState === StudentStudyState.DROPPED_OUT ? 'red' : 'green';

  return (
    <ListItem.Subtitle style={{ color }}>{convertStudentStudyState(studyState)}</ListItem.Subtitle>
  );
};

export default MemberStudyState;

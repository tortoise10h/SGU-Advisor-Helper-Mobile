import React from 'react';
import { Badge } from 'react-native-elements';
import {
  convertClassMembershipPosition,
  MembershipPosition,
} from '../../../../common/constants/user';
import { appColor } from '../../../styles/color';

const ClassMemberRoleBadge = ({
  value,
  containerStyle,
  badgeStyle,
}: {
  value: string;
  containerStyle?: any;
  badgeStyle?: any;
}) => {
  const displayRole = convertClassMembershipPosition(value);

  let color = appColor.primaryColor;

  switch (value) {
    case MembershipPosition.ADVISOR: {
      color = '#4c2f65';
      break;
    }

    case MembershipPosition.MONITOR: {
      color = appColor.primaryColor;
      break;
    }

    case MembershipPosition.VICE_MONITOR: {
      color = '#71b4d1';
      break;
    }

    case MembershipPosition.SECRETARY: {
      color = '#77dd77';
      break;
    }

    default:
      break;
  }

  return (
    <Badge
      status="success"
      value={displayRole}
      containerStyle={{ ...containerStyle }}
      badgeStyle={{ ...badgeStyle, backgroundColor: color }}
    />
  );
};

export default ClassMemberRoleBadge;

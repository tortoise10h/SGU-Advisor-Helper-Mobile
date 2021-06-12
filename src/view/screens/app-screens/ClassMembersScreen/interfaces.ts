import { MembershipPosition } from '../../../../common/constants/user';

export interface IClassMemberData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  sguId: string;
  role: string;
  claims: {
    schoolYearEnd: number;
    schoolYearStart: number;
  };
  memberships: [
    {
      id: string;
      classroomId: string;
      userId: string;
      position: MembershipPosition;
      status: string;
      note: string;
    }
  ];
}

export interface IFailedStudentData {
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
  memberships: IFailedStudentMembership[];
  subjectScores: IFailedStudentSubjectItem[];
}

export interface IFailedStudentSubjectItem {
  subject: {
    id: string;
    code: string;
    name: string;
  };
  tenPointGrading: string;
  fourPointGrading: string;
  classGrading: string;
  passed: boolean;
  canceled: boolean;
}

export interface IFailedStudentMembership {
  id: string;
  classroomId: string;
  userId: string;
  position: string;
}

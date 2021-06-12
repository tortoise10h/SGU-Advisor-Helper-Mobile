export interface IWeakStudentData {
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
  memberships: IWeakStudentMembership[];
  semesterScores: IWeakStudentSemesterScore[];
}

export interface IWeakStudentSemesterScore {
  semesterCode: string;
  tenPointGradingAverageScore: string;
  fourPointGradingAverageScore: string;
  cumulativeTenPointGradingAverageScore: string;
  cumulativeFourPointGradingAverageScore: string;
  semesterCreditCount: number;
  cumulativeCreditCount: number;
}

export interface IWeakStudentMembership {
  id: string;
  classroomId: string;
  userId: string;
  position: string;
}

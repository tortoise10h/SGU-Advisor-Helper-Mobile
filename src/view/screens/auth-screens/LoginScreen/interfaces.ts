export interface IStepScreenData {
  key: string;
  title: string;
  description: string;
  [key: string]: any;
}

export interface IUserInfo {
  sguPassword?: string;
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  sguId: string;
  major: {
    faculty: {
      id: string;
      name: string;
    },
    facultyId: string;
    id: string;
    name: string;
  },
  claims: {
    schoolYearStart: string;
    schoolYearEnd: string;
  },
  memberships: IMemberShip[],
};

export interface IMemberShip {
  classroom: {
    code: string;
    id: string;
    majorId: string;
    name: string;
    schoolYearStart: string;
    schoolYearEnd: string;
    settings: any;
  },
  classroomId: string;
  isAdviser: boolean;
}

export interface IAccountRegistration {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  studentId: string;
  classroomId: string;
  password: string;
}

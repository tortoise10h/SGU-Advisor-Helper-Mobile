export enum UserRole {
  LECTURER = 'Lecturer',
  STUDENT = 'Student',
}

export enum MembershipPosition {
  ADVISOR = 'Advisor',
  STUDENT = 'Student',
  MONITOR = 'Monitor',
  VICE_MONITOR = 'ViceMonitor',
  SECRETARY = 'Secretary',
}

export enum StudentStudyState {
  ACTIVE = 'Active',
  DROPPED_OUT = 'DroppedOut',
  COMPLETED = 'Completed',
}

export const FAILED_GRADE_CHAR = 'F';
export const WARNING_GRADE_CHAR = 'D';

export const ClassCorePositions = [MembershipPosition.ADVISOR, MembershipPosition.MONITOR];
export const EXCEPT_SUBJECT_CODES = ['KSTA30', 'KSTA60'];

export const convertUserGender = (gender: string) => {
  switch (gender) {
    case 'Male': {
      return 'Nam';
    }

    case 'Female': {
      return 'Nữ';
    }

    case 'Other': {
      return 'Giới tính khác';
    }

    default: {
      return 'Giới tính khác';
    }
  }
};

export const convertUserRole = (role: string) => {
  switch (role) {
    case UserRole.LECTURER: {
      return 'Cố vấn';
    }

    case UserRole.STUDENT: {
      return 'Sinh viên';
    }

    default: {
      return role;
    }
  }
};

export const convertStudentStudyState = (state: string) => {
  switch (state) {
    case StudentStudyState.ACTIVE: {
      return 'Đang học';
    }

    case StudentStudyState.DROPPED_OUT: {
      return 'Đã nghỉ học';
    }

    case StudentStudyState.COMPLETED: {
      return 'Đã học xong';
    }

    default: {
      return state;
    }
  }
};

export const convertClassMembershipPosition = (position: any) => {
  switch (position) {
    case MembershipPosition.ADVISOR: {
      return 'Cố vấn';
    }

    case MembershipPosition.MONITOR: {
      return 'Lớp trưởng';
    }

    case MembershipPosition.VICE_MONITOR: {
      return 'Lớp phó';
    }

    case MembershipPosition.SECRETARY: {
      return 'Bí thư';
    }

    case MembershipPosition.STUDENT: {
      return 'Sinh viên';
    }

    default: {
      return position;
    }
  }
};

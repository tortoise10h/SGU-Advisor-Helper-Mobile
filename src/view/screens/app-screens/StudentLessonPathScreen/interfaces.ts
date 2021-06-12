export interface ILessonData {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  id: string;
  code: string;
  name: string;
  creditCount: number;
  status: LessonStatus;
}

export enum LessonStatus {
  Passed = 'PASSED',
  Failed = 'FAILED',
  UnStudied = 'UN-STUDIED',
  Studying = 'STUDYING',
}

export interface IStudentScoreData {
  semester: string;
  semesterCode: string;
  scores: IStudentScoreItem[];
  tenPointGradingAverageScore: string;
  fourPointGradingAverageScore: string;
  cumulativeTenPointGradingAverageScore: string;
  cumulativeFourPointGradingAverageScore: string;
  semesterCreditCount: string;
  cumulativeCreditCount: string;
  semesterCodeNum: number;
}

export interface IStudentScoreItem {
  subject: {
    id: string;
    code: string;
    name: string;
  };
  tenPointGrading: string;
  fourPointGrading: string;
  classGrading: string;
  passed: boolean;
}

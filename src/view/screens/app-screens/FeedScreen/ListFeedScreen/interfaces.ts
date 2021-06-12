export interface IFeedData {
  attachments: any[];
  author: {
    claims: any[];
    email: string;
    positionInClassroom: string;
    firstName: string;
    lastName: string;
    gender: string;
    id: string;
    phone: string;
    role: string;
    sguId: string;
  },
  title: string;
  content: string;
  createdAt: Date;
  id: string;
  type: string;
  updatedAt: string;
  totalComment: number;
}

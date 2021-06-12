export interface IPostComment {
  id: string;
  content: string;
  postId: string;
  author: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    sguId: string;
    role: string;
  };
  createdAt: Date;
}

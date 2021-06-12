export interface IMessageData {
  id: string;
  content: string;
  isSending: boolean;
  type: MessageType;
  sender: {
    firstName: string;
    lastName: string;
    id: string;
    sguId: string;
    email: string;
    gender: string;
    positionInClassroom: string;
    role: string;
  }
}

export enum MessageType {
  TEXT = 'Text',
  IMAGE = 'Image',
  FILE = 'File',
}

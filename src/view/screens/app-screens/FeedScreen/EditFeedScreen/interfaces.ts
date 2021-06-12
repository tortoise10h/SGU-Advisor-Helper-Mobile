export interface IPickedFile {
  name: string;
  uri: string;
  fileCopyUri: string;
  size: number;
  type: string;
}

export interface IPostAttachment {
  url: string;
  fileName: string;
  type: string;
}

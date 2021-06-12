export const getFileExtension = (filePath: string) => {
  return filePath.split('.').pop();
};

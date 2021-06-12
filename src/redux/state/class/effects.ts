import { callApiAuth } from '../../../common/api/effect';
import {CLASS_ENDPOINTS} from '../../../common/api/models';
import { APIRequestMethod } from '../../../common/constants/common';

const getMyClasses = async (): Promise<any> => {
  const result = await callApiAuth({
    url: CLASS_ENDPOINTS.getMyClasses,
    method: APIRequestMethod.GET,
  });

  return result;
};

const updateClassSetting = async (classroomId: string, settings: any): Promise<any> => {
  const data = {
    ...settings,
  };
  const result = await callApiAuth({
    url: CLASS_ENDPOINTS.updateClassSetting(classroomId),
    method: APIRequestMethod.PATCH,
    data,
  });

  return result;
};

export { getMyClasses, updateClassSetting };

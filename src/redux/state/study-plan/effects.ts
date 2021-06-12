import { callApiAuth } from '../../../common/api/effect';
import { STUDY_PLAN_ENDPOINTS } from '../../../common/api/models';
import { APIRequestMethod } from '../../../common/constants/common';
import { MessageType } from '../../../view/screens/app-screens/ChatZoneScreen/interfaces';

export interface ISendMessageParam {
  content: string;
  type: MessageType;
}

const getStudyPlans = async (
  classroomId: string,
  filter?: any,
  filterCondition?: any
): Promise<any> => {
  let paramsObj: any;
  if (filter && filterCondition) {
    paramsObj = {
      filter,
      filterCondition,
    };
  }

  return await callApiAuth({
    url: STUDY_PLAN_ENDPOINTS.getStudyPlans(classroomId),
    method: APIRequestMethod.GET,
    params: paramsObj,
  });
};

const createStudyPlan = async (
  classroomId: string,
  {
    title,
    description,
    imageUrl,
    time,
  }: { title: string; description?: string; imageUrl?: string; time: Date }
): Promise<any> => {
  const data = {
    title,
    description,
    imageUrl,
    time,
  };

  return await callApiAuth({
    url: STUDY_PLAN_ENDPOINTS.createStudyPlan(classroomId),
    method: APIRequestMethod.POST,
    data,
  });
};

const updateStudyPlan = async (
  classroomId: string,
  studyPlanId: string,
  {
    title,
    description,
    imageUrl,
    time,
  }: { title?: string; description?: string; imageUrl?: string; time?: Date }
): Promise<any> => {
  const data = {
    title,
    description,
    imageUrl,
    time,
  };

  return await callApiAuth({
    url: STUDY_PLAN_ENDPOINTS.updateStudyPlan(classroomId, studyPlanId),
    method: APIRequestMethod.PATCH,
    data,
  });
};

const deleteStudyPlan = async (classroomId: string, studyPlanId: string): Promise<any> => {
  return await callApiAuth({
    url: STUDY_PLAN_ENDPOINTS.deleteStudyPlan(classroomId, studyPlanId),
    method: APIRequestMethod.DELETE,
  });
};

export { createStudyPlan, getStudyPlans, updateStudyPlan, deleteStudyPlan };

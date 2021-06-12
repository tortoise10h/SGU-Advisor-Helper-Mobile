import { callApiAuth } from '../../../common/api/effect';
import { CLASS_ENDPOINTS } from '../../../common/api/models';
import { APIRequestMethod } from '../../../common/constants/common';
import { MembershipPosition } from '../../../common/constants/user';

const getMyClassMembers = async (classroomId: string): Promise<any> => {
  return await callApiAuth({
    url: CLASS_ENDPOINTS.getMyClassMembers(classroomId),
    method: APIRequestMethod.GET,
  });
};

const changeMemberPosition = async (
  classroomId: string,
  userId: string,
  newPosition: MembershipPosition
): Promise<any> => {
  const data = {
    position: newPosition,
  };

  return await callApiAuth({
    url: CLASS_ENDPOINTS.changePositionOfMember(classroomId, userId),
    method: APIRequestMethod.PATCH,
    data,
  });
};

const updateStudentInClassInfo = async (
  classroomId: string,
  userId: string,
  info: any
): Promise<any> => {
  const data = info;

  return await callApiAuth({
    url: CLASS_ENDPOINTS.changePositionOfMember(classroomId, userId),
    method: APIRequestMethod.PATCH,
    data,
  });
};

const getStudentScore = async (sguId: string) => {
  return await callApiAuth({
    url: CLASS_ENDPOINTS.getStudentScore(sguId),
    method: APIRequestMethod.GET,
  });
};

const statisticFailedStudentBySemester = async (classroomId: string, semesterCode: string) => {
  return await callApiAuth({
    url: CLASS_ENDPOINTS.statisticFailedStudentBySemester(classroomId, semesterCode),
    method: APIRequestMethod.GET,
  });
};

const statisticWeakStudentBySemester = async (classroomId: string, semesterCode: string) => {
  return await callApiAuth({
    url: CLASS_ENDPOINTS.statisticWeakStudentBySemester(classroomId, semesterCode),
    method: APIRequestMethod.GET,
  });
};

const statisticDebtStudentsOfClass = async (classroomId: string) => {
  return await callApiAuth({
    url: CLASS_ENDPOINTS.statisticDebtStudents(classroomId),
    method: APIRequestMethod.GET,
  });
};

const getStudentSchedule = async (semesterCode: string, sguId: string) => {
  const result = await callApiAuth({
    url: CLASS_ENDPOINTS.getStudentSchedule(semesterCode, sguId),
    method: APIRequestMethod.GET,
  });
  return result;
};

const getLessonPath = async (userId: string) => {
  const result = await callApiAuth({
    url: CLASS_ENDPOINTS.getLessonPath(userId),
    method: APIRequestMethod.GET,
  });
  return result;
};

export {
  getMyClassMembers,
  changeMemberPosition,
  getStudentScore,
  statisticFailedStudentBySemester,
  statisticWeakStudentBySemester,
  getStudentSchedule,
  updateStudentInClassInfo,
  statisticDebtStudentsOfClass,
  getLessonPath,
};

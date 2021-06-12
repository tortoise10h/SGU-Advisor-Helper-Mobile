import { API_DEFAULT_URL } from '../../config';

export const USER_ENDPOINTS = {
  login: `${API_DEFAULT_URL}/v1/auth/login`,
  getUserById: (userId: string) => `${API_DEFAULT_URL}/users/${userId}`,
  getInfoBySGUId: (sguId: string) => `${API_DEFAULT_URL}/v1/users/${sguId}`,
  verifyThongTinDaoTaoPassword: `${API_DEFAULT_URL}/v1/auth/verify`,
  registerNewAccount: `${API_DEFAULT_URL}/v1/auth/register`,
  setUserFCMToken: `${API_DEFAULT_URL}/v1/users/me/firebase-tokens`,
  removeUserFCMToken: (token: string) => `${API_DEFAULT_URL}/v1/users/me/firebase-tokens/${token}`,
};

export const CLASS_ENDPOINTS = {
  getMyClasses: `${API_DEFAULT_URL}/v1/users/me/classrooms`,
  getMyClassMembers: (classroomId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/members`,
  changePositionOfMember: (classroomId: string, userId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/members/${userId}`,
  getStudentScore: (sguId: string) => `${API_DEFAULT_URL}/v1/users/${sguId}/scores`,
  statisticFailedStudentBySemester: (classroomId: string, semesterCode: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/statistic/${semesterCode}/not-passed-students`,
  statisticWeakStudentBySemester: (classroomId: string, semesterCode: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/statistic/${semesterCode}/weak-students`,
  statisticDebtStudents: (classroomId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/statistic/owes-tuition-students`,
  getStudentSchedule: (semesterCode: string, sguId: string) =>
    `${API_DEFAULT_URL}/v1/users/${sguId}/schedules/${semesterCode}`,
  getLessonPath: (userId: string) => `${API_DEFAULT_URL}/v1/users/${userId}/subjects`,
  updateClassSetting: (classroomId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/settings`,
};

export const POST_ENDPOINTS = {
  createPost: (classroomId: string) => `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/posts`,
  getPosts: (classroomId: string) => `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/posts`,
  deletePost: (classroomId: string, postId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/posts/${postId}`,
  getPostById: (classroomId: string, postId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/posts/${postId}`,
  updatePost: (classroomId: string, postId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/posts/${postId}`,
};

export const COMMENT_ENDPOINTS = {
  createComment: (postId: string) => `${API_DEFAULT_URL}/v1/posts/${postId}/comments`,
  getComments: (postId: string) => `${API_DEFAULT_URL}/v1/posts/${postId}/comments`,
  deleteComment: (postId: string, commentId: string) =>
    `${API_DEFAULT_URL}/v1/posts/${postId}/comments/${commentId}`,
};

export const MESSAGE_ENDPOINTS = {
  sendMessage: (conversationId: string) => `${API_DEFAULT_URL}/v1/chats/${conversationId}/messages`,
  getMessages: (conversationId: string) => `${API_DEFAULT_URL}/v1/chats/${conversationId}/messages`,
};

export const STUDY_PLAN_ENDPOINTS = {
  getStudyPlans: (classroomId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/study-plans`,
  createStudyPlan: (classroomId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/study-plans`,
  deleteStudyPlan: (classroomId: string, studyPlanId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/study-plans/${studyPlanId}`,
  updateStudyPlan: (classroomId: string, studyPlanId: string) =>
    `${API_DEFAULT_URL}/v1/classrooms/${classroomId}/study-plans/${studyPlanId}`,
};

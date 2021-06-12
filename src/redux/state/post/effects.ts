import { callApiAuth } from '../../../common/api/effect';
import { POST_ENDPOINTS } from '../../../common/api/models';
import { APIRequestMethod } from '../../../common/constants/common';
import { IPostAttachment } from '../../../view/screens/app-screens/FeedScreen/CreateFeedScreen/interfaces';

const createPost = async (
  classroomId: string,
  {
    title,
    content,
    attachments,
  }: { title: string; content: string; attachments: IPostAttachment[] }
): Promise<any> => {
  const data = {
    title,
    content,
    attachments,
  };

  return await callApiAuth({
    url: POST_ENDPOINTS.createPost(classroomId),
    method: APIRequestMethod.POST,
    data,
  });
};

const updatePost = async (
  classroomId: string,
  postId: string,
  {
    title,
    content,
    attachments,
  }: { title: string; content: string; attachments: IPostAttachment[] }
): Promise<any> => {
  const data = {
    title,
    content,
    attachments,
  };

  return await callApiAuth({
    url: POST_ENDPOINTS.updatePost(classroomId, postId),
    method: APIRequestMethod.PATCH,
    data,
  });
};

const getPosts = async (
  classroomId: string,
  page: number = 1,
  limit: number = 10,
  params?: any
): Promise<any> => {
  const result = await callApiAuth({
    url: POST_ENDPOINTS.getPosts(classroomId),
    method: APIRequestMethod.GET,
    params: {
      ...params,
      page,
      limit,
    },
  });

  return result;
};

const deletePost = async (classroomId: string, postId: string): Promise<any> => {
  const result = await callApiAuth({
    url: POST_ENDPOINTS.deletePost(classroomId, postId),
    method: APIRequestMethod.DELETE,
  });

  return result;
};

const getPostById = async (classroomId: string, postId: string) => {
  const result = await callApiAuth({
    url: POST_ENDPOINTS.getPostById(classroomId, postId),
    method: APIRequestMethod.GET,
  });

  return result;
};

export { createPost, updatePost, getPosts, deletePost, getPostById };

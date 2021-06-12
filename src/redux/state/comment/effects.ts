import { callApiAuth } from '../../../common/api/effect';
import { COMMENT_ENDPOINTS } from '../../../common/api/models';
import { APIRequestMethod } from '../../../common/constants/common';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../config';

const createComment = async (postId: string, { content }: { content: string }): Promise<any> => {
  const data = {
    content,
  };

  return await callApiAuth({
    url: COMMENT_ENDPOINTS.createComment(postId),
    method: APIRequestMethod.POST,
    data,
  });
};

const getComments = async (
  postId: string,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  params?: any
): Promise<any> => {
  const result = await callApiAuth({
    url: COMMENT_ENDPOINTS.getComments(postId),
    method: APIRequestMethod.GET,
    params: {
      ...params,
      page,
      limit,
    },
  });

  return result;
};

const deleteComment = async (postId: string, commentId: string): Promise<any> => {
  const result = await callApiAuth({
    url: COMMENT_ENDPOINTS.deleteComment(postId, commentId),
    method: APIRequestMethod.DELETE,
  });

  return result;
};

export { createComment, getComments, deleteComment };

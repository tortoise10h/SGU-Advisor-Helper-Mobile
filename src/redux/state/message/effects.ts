import { callApiAuth } from '../../../common/api/effect';
import { MESSAGE_ENDPOINTS } from '../../../common/api/models';
import { APIRequestMethod } from '../../../common/constants/common';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../config';
import {MessageType} from '../../../view/screens/app-screens/ChatZoneScreen/interfaces';

export interface ISendMessageParam {
  content: string;
  type: MessageType;
}

const sendMessages = async (
  conversationId: string,
  messages: ISendMessageParam[]
): Promise<any> => {
  const data = {
    messages,
  };

  return await callApiAuth({
    url: MESSAGE_ENDPOINTS.sendMessage(conversationId),
    method: APIRequestMethod.POST,
    data,
  });
};

const getMessages = async (
  conversationId: string,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  params?: any
): Promise<any> => {
  const result = await callApiAuth({
    url: MESSAGE_ENDPOINTS.getMessages(conversationId),
    method: APIRequestMethod.GET,
    params: {
      ...params,
      page,
      limit,
    },
  });

  return result;
};

export { sendMessages, getMessages };

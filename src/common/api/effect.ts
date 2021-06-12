import axios from 'axios';
import { APIRequestMethod, APIRequestSetting } from '../constants/common';
import httpStatusCode from 'http-status-codes';
import store from '../../redux/store';
import { setGlobalErrorAction } from '../../redux/state/global/saga-types';
import { PersistHandlers, PersistKeys } from '../persistent-store';
import Qs from 'qs';

interface ICallAPIParams {
  url: string;
  method: APIRequestMethod;
  headers?: any;
  options?: any;
  data?: any;
  params?: any;
}

const handleApiPossibleErrorResponse = (error: any) => {
  switch (error.response.status) {
    case httpStatusCode.UNAUTHORIZED: {
      if (!error.response.data.code) {
        store.dispatch({
          type: setGlobalErrorAction.type,
          payload: { error: error.response.data.message },
        });
        return null;
      }
      break;
    }

    case httpStatusCode.BAD_REQUEST: {
      if (!error.response.data.code) {
        store.dispatch({
          type: setGlobalErrorAction.type,
          payload: { error: error.response.data.message },
        });
        return null;
      }
      break;
    }

    case httpStatusCode.NOT_FOUND:
    case httpStatusCode.INTERNAL_SERVER_ERROR: {
      store.dispatch({ type: setGlobalErrorAction.type, payload: { error: 'Có lỗi xảy ra' } });
      return null;
    }
  }
};

const callApi = async ({ method, url, headers, data, options }: ICallAPIParams): Promise<any> => {
  try {
    const result = await axios({
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: APIRequestSetting.CALL_API_TIMEOUT,
      ...options,
      data,
    });

    return result;
  } catch (error) {
    console.log('[callApi] error.response.data: ', error.response.data);
    handleApiPossibleErrorResponse(error);
    throw error;
  }
};

const callApiAuth = async ({ method, url, headers, data, options, params }: ICallAPIParams) => {
  try {
    const userToken = await PersistHandlers.getItemAsObject(PersistKeys.USER_TOKEN_KEY);

    axios.interceptors.request.use(config => {
      config.paramsSerializer = params => {
        // Qs is already included in the Axios package
        return Qs.stringify(params, {
          arrayFormat: 'brackets',
          encode: false,
        });
      };

      return config;
    });
    return await axios({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken.accessToken}`,
        ...headers,
      },
      timeout: APIRequestSetting.CALL_API_TIMEOUT,
      ...options,
      params,
      data,
    });
  } catch (error) {
    console.log('[callApiAuth] error.response.data: ', error.response.data);
    handleApiPossibleErrorResponse(error);
  }
};

export { callApi, callApiAuth };

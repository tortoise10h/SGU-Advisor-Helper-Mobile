import { callApi, callApiAuth } from '../../../common/api/effect';
import { APIRequestMethod } from '../../../common/constants/common';
import { USER_ENDPOINTS } from '../../../common/api/models';
import { IAccountRegistration } from '../../../view/screens/auth-screens/LoginScreen/interfaces';

const login = async (sguId: string, password: string): Promise<any> => {
  const data = {
    sguId,
    password,
  };

  const result = await callApi({
    url: USER_ENDPOINTS.login,
    method: APIRequestMethod.POST,
    data,
  });

  return result;
};

const getInfoBySGUId = async (sguId: string): Promise<any> => {
  return await callApi({
    url: USER_ENDPOINTS.getInfoBySGUId(sguId),
    method: APIRequestMethod.GET,
  });
};

const setUserFCM = async (fcmToken: string): Promise<any> => {
  const data = {
    firebaseToken: fcmToken,
  };

  const result = await callApiAuth({
    url: USER_ENDPOINTS.setUserFCMToken,
    method: APIRequestMethod.POST,
    data,
  });

  return result;
};

const removeUserFCMToken = async (fcmToken: string): Promise<any> => {
  const result = await callApiAuth({
    url: USER_ENDPOINTS.removeUserFCMToken(fcmToken),
    method: APIRequestMethod.DELETE,
  });

  return result;
};

const verifyThongTinDaoTaoPassword = async (sguId: string, password: string): Promise<any> => {
  try {
    const data = {
      sguId,
      password,
    };
    return await callApi({
      url: USER_ENDPOINTS.verifyThongTinDaoTaoPassword,
      method: APIRequestMethod.POST,
      data,
    });
  } catch (error) {
    console.log('[verifyThongTinDaoTaoPassword] error: ', error);
    return null;
  }
};

const registerNewAccount = async (registerInfo: IAccountRegistration): Promise<any> => {
  try {
    return await callApi({
      url: USER_ENDPOINTS.registerNewAccount,
      method: APIRequestMethod.POST,
      data: registerInfo,
    });
  } catch (error) {
    console.log('[registerNewAccount] error: ', error);
    return null;
  }
};

export {
  login,
  getInfoBySGUId,
  verifyThongTinDaoTaoPassword,
  registerNewAccount,
  setUserFCM,
  removeUserFCMToken,
};

import httpStatus from 'http-status-codes';

export const createCallApiError = (statusCode: number, err: any) => {
  console.log('[createGlobalError] err: ', err);
  switch (statusCode) {
    case httpStatus.NOT_FOUND: {
      return {
        error: 'Server NOT FOUND error',
      };
    }
    case httpStatus.BAD_REQUEST: {
      return {
        error: err.message,
      };
    }
    default: return {
      error: 'This is for testing error',
    };
  }
};

export const createNormalError = (data: any) => {
  return {
    error: data,
  };
};

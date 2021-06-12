import { AuthenticationStack } from './stacks/Authentication';
import { ProfessorStack } from './stacks/Professor';
import { StudentStack } from './stacks/Student';
import { UserRole } from '../../src/common/constants/user';
import { IUserToken } from '../common/interfaces/user';

export const getStackByUser = (userToken: IUserToken, role: string) => {
  console.log('[getStackByUser] userToken: ', userToken);
  console.log('[getStackByUser] role: ', role);

  if (userToken && userToken.accessToken) {
    switch (role) {
      case UserRole.LECTURER: {
        return ProfessorStack;
      }
      case UserRole.STUDENT: {
        return StudentStack;
      }
      default: return AuthenticationStack;
    }
  } else {
    return AuthenticationStack;
  }
};

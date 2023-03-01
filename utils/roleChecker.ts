import { ADMIN_TOKEN, ROLES, USER_TOKEN } from '../constants/constants';

interface CheckRole {
  token: string;
}

export const checkRole = (value: string): CheckRole => {
  switch (value) {
    case ROLES.admin:
      return { token: ADMIN_TOKEN };
    case ROLES.student:
      return { token: USER_TOKEN };
    default:
      return { token: USER_TOKEN };
  }
};

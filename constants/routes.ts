export const BASE_URL = '/api/v2';

export const SIGN_UP_ROUTE = BASE_URL + '/auth/signup';
export const SIGN_IN_ROUTE = BASE_URL + '/auth/signin';

export const PERMISSIONS_ROUTE = BASE_URL + '/permissions';

export const POLLS_ROUTE = BASE_URL + '/polls';
export const POLLS_BY_ID_ROUTE = BASE_URL + '/polls/:id';

export const SEARCH_ROUTE = BASE_URL + '/search/:query';

export const USER_ROUTE = BASE_URL + '/user';
export const USER_BY_ID_ROUTE = BASE_URL + '/user/:id';
export const USER_DISABLE_ROUTE = BASE_URL + '/user/disable/:id';
export const USER_PERMISSION_ASSIGN_ROUTE =
  BASE_URL + '/user/permissions/assign';
export const USER_PERMISSION_UNASSIGN_ROUTE =
  BASE_URL + '/user/permissions/unassign';

export const VOTES_ROUTE = BASE_URL + '/votes';
export const VOTES_BY_ID_ROUTE = BASE_URL + '/votes/:id';
export const VOTES_BY_USER_ROUTE = BASE_URL + '/votes/user/:id';

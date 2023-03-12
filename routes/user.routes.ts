import express from 'express';

import verifyTokenAdmin from '../middlewares/verifyTokenAdmin';
import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';

import {
  getUsers,
  getUser,
  disableUser,
  assignPermission,
  unassignPermission,
} from '../controllers/user.controller';

import {
  USER_ROUTE,
  USER_BY_ID_ROUTE,
  USER_DISABLE_ROUTE,
  USER_PERMISSION_ASSIGN_ROUTE,
  USER_PERMISSION_UNASSIGN_ROUTE,
} from '../constants/routes';

const router = express.Router();

router.get(USER_ROUTE, verifyTokenAdmin, getUsers);
router.get(USER_BY_ID_ROUTE, verifyTokenGeneral, getUser);
router.delete(USER_DISABLE_ROUTE, verifyTokenAdmin, disableUser);
router.put(USER_PERMISSION_ASSIGN_ROUTE, verifyTokenAdmin, assignPermission);
router.put(
  USER_PERMISSION_UNASSIGN_ROUTE,
  verifyTokenAdmin,
  unassignPermission
);

export default router;

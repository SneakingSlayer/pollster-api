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

const router = express.Router();

router.get('/user', verifyTokenAdmin, getUsers);
router.get('/user/:id', verifyTokenGeneral, getUser);
router.get('/user/disable/:id', verifyTokenAdmin, disableUser);
router.put('/user/permissions/assign', verifyTokenAdmin, assignPermission);
router.put('/user/permissions/unassign', verifyTokenAdmin, unassignPermission);

export default router;

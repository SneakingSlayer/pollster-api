import express from 'express';

import verifyTokenAdmin from '../middlewares/verifyTokenAdmin';

import {
  getPermissions,
  createPermission,
} from '../controllers/permissions.controller';

import { PERMISSIONS_ROUTE } from '../constants/routes';

const router = express.Router();

router.get(PERMISSIONS_ROUTE, verifyTokenAdmin, getPermissions);
router.post(PERMISSIONS_ROUTE, verifyTokenAdmin, createPermission);

export default router;

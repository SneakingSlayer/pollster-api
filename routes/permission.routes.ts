import express from 'express';
import verifyTokenAdmin from '../middlewares/verifyTokenAdmin';
import {
  getPermissions,
  createPermission,
} from '../controllers/permissions.controller';

const router = express.Router();

router.get('/permissions', verifyTokenAdmin, getPermissions);
router.post('/permissions', verifyTokenAdmin, createPermission);

export default router;

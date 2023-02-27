import express from 'express';

import { signIn, signUp } from '../controllers/auth.controllers';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '../constants/routes';

const router = express.Router();

router.post(SIGN_IN_ROUTE, signIn);
router.post(SIGN_UP_ROUTE, signUp);

export default router;

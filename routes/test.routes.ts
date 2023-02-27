import express from 'express';
import { test } from '../controllers/test.controller';

const router = express.Router();

router.post('/test', test);

export default router;

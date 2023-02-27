import express from 'express';
import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';

const router = express.Router();

import { searchPoll } from '../controllers/search.controller';

router.get('/search/:query', verifyTokenGeneral, searchPoll);

export default router;

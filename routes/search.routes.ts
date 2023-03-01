import express from 'express';

import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';

import { SEARCH_ROUTE } from '../constants/routes';

const router = express.Router();

import { searchPoll } from '../controllers/search.controller';

router.get(SEARCH_ROUTE, verifyTokenGeneral, searchPoll);

export default router;

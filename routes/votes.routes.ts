import express from 'express';

import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';

import { addVote, getVote } from '../controllers/vote.controller';

import { VOTES_ROUTE, VOTES_BY_ID_ROUTE } from '../constants/routes';

const router = express.Router();

router.post(VOTES_ROUTE, verifyTokenGeneral, addVote);
router.get(VOTES_BY_ID_ROUTE, verifyTokenGeneral, getVote);

export default router;

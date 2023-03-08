import express from 'express';

import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';

import { addVote, getUserVotes, getVote } from '../controllers/vote.controller';

import {
  VOTES_ROUTE,
  VOTES_BY_ID_ROUTE,
  VOTES_BY_USER_ROUTE,
} from '../constants/routes';

const router = express.Router();

router.post(VOTES_ROUTE, verifyTokenGeneral, addVote);
router.get(VOTES_BY_ID_ROUTE, verifyTokenGeneral, getVote);
router.get(VOTES_BY_USER_ROUTE, verifyTokenGeneral, getUserVotes);

export default router;

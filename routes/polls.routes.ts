import express from 'express';

import verifyTokenAdmin from '../middlewares/verifyTokenAdmin';
import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';

import {
  getPolls,
  getPoll,
  createPoll,
  updatePoll,
  deletePoll,
} from '../controllers/polls.controller';

import { POLLS_ROUTE, POLLS_BY_ID_ROUTE } from '../constants/routes';

const router = express.Router();

router.get(POLLS_ROUTE, verifyTokenGeneral, getPolls);
router.get(POLLS_BY_ID_ROUTE, verifyTokenGeneral, getPoll);
router.post(POLLS_ROUTE, verifyTokenGeneral, createPoll);
router.put(POLLS_BY_ID_ROUTE, verifyTokenGeneral, updatePoll);
router.delete(POLLS_BY_ID_ROUTE, verifyTokenAdmin, deletePoll);

export default router;

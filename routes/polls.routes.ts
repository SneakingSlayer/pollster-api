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

const router = express.Router();

router.get('/polls', verifyTokenGeneral, getPolls);
router.get('/polls/:id', verifyTokenGeneral, getPoll);
router.post('/polls', verifyTokenGeneral, createPoll);
router.put('/polls/:id', verifyTokenGeneral, updatePoll);
router.delete('/polls/:id', verifyTokenAdmin, deletePoll);

export default router;

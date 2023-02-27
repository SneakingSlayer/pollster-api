import express from 'express';
import verifyTokenGeneral from '../middlewares/verfiyTokenGeneral';
import { addVote, getVote } from '../controllers/vote.controller';

const router = express.Router();

router.post('/votes', verifyTokenGeneral, addVote);
router.get('/votes/:id', verifyTokenGeneral, getVote);

export default router;

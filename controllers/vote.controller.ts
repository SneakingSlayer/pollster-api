import { Request, Response } from 'express';
import Poll from '../models/poll.model';
import Vote from '../models/vote.model';

export const addVote = async (req: Request, res: Response) => {
  try {
    const findPoll = await Poll.findOne({ _id: req.body.poll_id });
    if (!findPoll) return res.status(404).json({ msg: 'Poll not found.' });
    const addVote = new Vote({
      user_id: req.body.user_id,
      poll_id: req.body.poll_id,
      title: req.body.title,
      poster_name: req.body.poster_name,
      choice: req.body.choice,
      choice_description: req.body.choice_description,
      date_created: Date.now(),
    });
    const saveVote = await addVote.save();
    const updatedPoll = await Poll.updateOne(
      { _id: req.body.poll_id },
      {
        $inc: {
          [`choices.${req.body.choice}.votes`]: 1,
        },
      }
    );
    const getPoll = await Poll.aggregate([
      {
        $match: { $expr: { $eq: ['$_id', { $toObjectId: req.body.poll_id }] } },
      },
      { $addFields: { totalVotes: { $sum: '$choices.votes' } } },
      { $limit: 1 },
    ]);
    res.status(200).json(getPoll[0]);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const getVote = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const findVote = await Vote.find({ poll_id: id });
    res.status(200).json(findVote);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const getUserVotes = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const id = req.params.id;
    const findVote = await Vote.find({ user_id: id })
      .sort({ createdAt: -1 })
      .skip(((page as number) - 1) * (limit as number))
      .limit((limit as number) * 1);

    const count = await Vote.countDocuments({ user_id: id });
    return res.status(200).json({
      votes: findVote,
      totalPages: Math.ceil(count / (limit as number)),
      currentPage: parseInt(page as string),
    });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

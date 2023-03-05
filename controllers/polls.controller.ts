import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

import Poll from '../models/poll.model';
import Vote from '../models/vote.model';
import User from '../models/user.model';

// TODO: Implement pagination
export const getPolls = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const polls = await Poll.aggregate([
      { $addFields: { totalVotes: { $sum: '$choices.votes' } } },
      { $sort: { createdAt: -1 } },
      { $skip: ((page as number) - 1) * (limit as number) },
      { $limit: (limit as number) * 1 },
    ]);
    /* .limit((limit as number) * 1)
      .skip(((page as number) - 1) * (limit as number))
      .sort({ createdAt: -1 });*/

    const count = await Poll.countDocuments();

    res.status(200).json({
      polls,
      totalPages: Math.ceil(count / (limit as number)),
      currentPage: parseInt(page as string),
    });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const getPoll = async (req: Request, res: Response) => {
  try {
    const poll = await Poll.findOne({ _id: req.params.id });
    console.log(poll);
    const total = poll.choices
      .map((choice: { votes: number }) => choice.votes)
      .reduce((prev: number, curr: number) => {
        return prev + curr;
      });

    res.status(200).json({
      ...poll.toObject(),
      totalVotes: total,
    });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const createPoll = async (req: Request, res: Response) => {
  /*const upload = await cloudinary.uploader.upload(req.body.img);
  if (!upload)
    return res
      .status(500)
      .json({ msg: 'There was a problem with your request.' });*/
  const user = await User.findOne({ _id: req.body.user_id });
  if (!user) return res.status(400).json({ msg: 'No user found.' });
  const poll = new Poll({
    ...req.body,
    firstname: user.firstname,
    lastname: user.lastname,
  });

  try {
    const savePoll = await poll.save();
    res.status(200).json(savePoll);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const updatePoll = async (req: Request, res: Response) => {
  const poll = await Poll.findOne({ _id: req.params.id });
  const currentCount = poll.choices.filter(
    (choice: { idx: string }) => choice.idx === req.body.idx
  );
  const query = {
    _id: req.params.id,
    'choices.idx': req.body.idx,
  };
  const update = {
    $set: {
      'choices.$.votes': parseInt(currentCount[0].votes) + 1,
    },
  };

  try {
    const voteUpdate = await Poll.updateOne(query, update);
    res.status(200).json({ msg: 'Votes successfully updated.' });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const deletePoll = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletePoll = await Poll.deleteOne({ _id: id });
    const deleteVotes = await Vote.deleteMany({ poll_id: id });
    res.status(200).json({ msg: 'Polls and votes successfully deleted.' });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

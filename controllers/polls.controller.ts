import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

import Poll from '../models/poll.model';
import Vote from '../models/vote.model';
import User from '../models/user.model';

export const getPolls = async (req: Request, res: Response) => {
  try {
    const polls = await Poll.aggregate([
      {
        $project: {
          choices: '$choices',
          date_created: '$date_created',
          description: '$description',
          firstname: '$firstname',
          lastname: '$lastname',
          title: '$title',
          votes: '$votes',
          user_id: '$user_id',
          img: '$img',
          totalVotes: {
            $sum: '$choices.votes',
          },
        },
      },
      { $sort: { date_created: -1 } },
    ]);
    res.status(200).json(polls);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const getPoll = async (req: Request, res: Response) => {
  try {
    let total = 0;
    const poll = await Poll.find({ _id: req.params.id });
    const voteMap = poll[0].choices.map((choice: { votes: string }) => {
      total += parseInt(choice.votes);
    });

    res.status(200).json([
      {
        _id: poll[0]._id,
        choices: poll[0].choices,
        date_created: poll[0].date_created,
        description: poll[0].description,
        firstname: poll[0].firstname,
        lastname: poll[0].lastname,
        title: poll[0].title,
        votes: poll[0].votes,
        user_id: poll[0].user_id,
        img: poll[0].img,
        totalVotes: total,
      },
    ]);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const createPoll = async (req: Request, res: Response) => {
  const upload = await cloudinary.uploader.upload(req.body.img);
  if (!upload)
    return res
      .status(500)
      .json({ msg: 'There was a problem with your request.' });
  const user = await User.findOne({ _id: req.body.user_id });
  if (!user) return res.status(400).json({ msg: 'No user found.' });
  const poll = new Poll({
    firstname: user.firstname,
    lastname: user.lastname,
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.description,
    img: upload.url,
    votes: req.body.votes,
    choices: req.body.choices,
    date_created: Date.now(),
  });

  try {
    const savePoll = await poll.save();
    res.status(200).json({ msg: 'Poll successfully posted.' });
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

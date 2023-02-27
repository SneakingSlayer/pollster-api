import { Request, Response } from 'express';
import Poll from '../models/poll.model';

export const searchPoll = async (req: Request, res: Response) => {
  try {
    const query = await Poll.find({
      title: { $regex: `.*${req.params.query}.*`, $options: 'i' },
    });
    res.status(200).json(query);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

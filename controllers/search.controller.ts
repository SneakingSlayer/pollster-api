import { Request, Response } from 'express';
import Poll from '../models/poll.model';

export const searchPoll = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = await Poll.find({
      title: { $regex: `.*${req.params.query}.*`, $options: 'i' },
    })
      .sort({ createdAt: -1 })
      .skip(((page as number) - 1) * (limit as number))
      .limit((limit as number) * 1);

    const count = await Poll.countDocuments({
      title: { $regex: `.*${req.params.query}.*`, $options: 'i' },
    });

    return res.status(200).json({
      query,
      totalPages: Math.ceil(count / (limit as number)),
      currentPage: parseInt(page as string),
    });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

import { Request, Response } from 'express';
import User from '../models/user.model';
import Vote from '../models/vote.model';
import Poll from '../models/poll.model';
import Disabled from '../models/disabled.model';
import { ROLES } from '../constants/constants';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(((page as number) - 1) * (limit as number))
      .limit((limit as number) * 1);

    const count = await User.countDocuments();
    res.status(200).json({
      users,
      totalPages: Math.ceil(count / (limit as number)),
      currentPage: parseInt(page as string),
    });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const findUser = await User.find({ _id: id });
    res.status(200).json(findUser);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const disableUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const findUser = await User.findOne({ _id: id });

    if (!findUser) return res.status(404).json({ msg: 'User not found.' });
    const newDisabled = new Disabled({ ...findUser._doc });
    const saveDisabled = await newDisabled.save();
    const deleteUser = await User.deleteOne({ _id: id });
    console.log(deleteUser);
    res.status(200).json({ msg: 'User removed.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const assignPermission = async (req: Request, res: Response) => {
  try {
    const findUser = await User.findOne({
      _id: req.body.user_id,
    });
    const findPermission = await User.find({
      _id: req.body.user_id,
      permissions: { $in: [req.body.permission] },
    }).count();
    if (findPermission > 0)
      return res.status(200).json({ msg: 'User has this permission.' });
    const query = { _id: req.body.user_id };
    const addPermission = {
      $push: { permissions: req.body.permission },
      role: ROLES.admin,  
    };
    const permission = await User.updateOne(query, addPermission);
    res.status(200).json({ msg: 'Permission successfully added.' });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

export const unassignPermission = async (req: Request, res: Response) => {
  try {
    const findUser = await User.findOne({
      _id: req.body.user_id,
    });
    const findPermission = await User.find({
      _id: req.body.user_id,
      permissions: { $in: [req.body.permission] },
    }).count();
    if (!findPermission)
      return res
        .status(200)
        .json({ msg: 'User does not have this permission.' });
    const query = { _id: req.body.user_id };
    const addPermission = {
      $pull: { permissions: req.body.permission },
    };

    const permission = await User.updateOne(query, addPermission);
    res.status(200).json({ msg: 'Permission successfully removed.' });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};

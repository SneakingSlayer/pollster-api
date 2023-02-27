import { Request, Response } from 'express';
import Permission from '../models/permission.model';

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  const permission = new Permission({
    permission: req.body.permission,
    name: req.body.name,
    date_created: Date.now(),
  });
  try {
    const newPermission = await permission.save();
    res.status(200).json({ msg: 'Permission successfully added.' });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

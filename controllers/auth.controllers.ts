import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { ORGANIZATION, ROLES } from '../constants/constants';

import { checkRole } from '../utils/roleChecker';

export const signIn = async (req: Request, res: Response) => {
  try {
    const checkUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (!checkUser) throw 'Invalid username or password.';

    const checkPass = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!checkPass) throw 'Invalid password.';

    const { token: secret } = checkRole(checkUser.role);
    const token = jwt.sign({ _id: checkUser._id }, secret, {
      expiresIn: '3d',
    });
    res.header('token', token).json({
      token: token,
      role: checkUser.role,
      id: checkUser._id,
      permissions: checkUser.permissions,
    });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const checkEmail = await User.findOne({ email: req.body.email });
    const checkUsername = await User.findOne({ username: req.body.username });
    if (checkEmail) throw 'Email already exists.';
    if (checkUsername) throw 'Username already exists.';
    const user = new User({
      ...req.body,
      organization: ORGANIZATION.abbrv,
      role: ROLES.student,
      password: hashPass,
    });
    const savedUser = await user.save();
    res.status(200).json({
      msg: `${req.body.username} successfully registered!`,
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  ADMIN_TOKEN,
  ORGANIZATION,
  ROLES,
  USER_TOKEN,
} from '../constants/constants';

export const signIn = async (req: Request, res: Response) => {
  const checkUsername = await User.findOne({ username: req.body.username });
  if (!checkUsername)
    return res.status(400).json({ status: 400, msg: 'Incorrect username.' });
  const checkPass = await bcrypt.compare(
    req.body.password,
    checkUsername.password
  );
  if (!checkPass)
    return res.status(400).json({ status: 400, msg: 'Incorrect password.' });

  if (checkUsername.role === 'student') {
    const token = jwt.sign({ _id: checkUsername._id }, USER_TOKEN, {
      expiresIn: '3d',
    });
    res.header('token', token).json({
      token: token,
      role: checkUsername.role,
      id: checkUsername._id,
      permissions: checkUsername.permissions,
    });
  }
  if (checkUsername.role === 'admin') {
    const token = jwt.sign({ _id: checkUsername._id }, ADMIN_TOKEN, {
      expiresIn: '3d',
    });
    res.header('token', token).json({
      token: token,
      role: checkUsername.role,
      id: checkUsername._id,
      permissions: checkUsername.permissions,
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);
  const checkEmail = await User.findOne({ email: req.body.email });
  const checkUsername = await User.findOne({ username: req.body.username });

  if (checkEmail) return res.status(400).json({ msg: 'Email already exists.' });
  if (checkUsername)
    return res.status(400).json({ msg: 'Username already exists.' });

  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    organization: ORGANIZATION.abbrv,
    role: ROLES.student,
    permissions: [],
    password: hashPass,
  });

  try {
    const savedUser = await user.save();
    res.status(200).json({
      msg: `${req.body.username} successfully registered!`,
    });
  } catch (err) {
    console.log('error');
    res.status(400).json({ msg: err });
  }
};

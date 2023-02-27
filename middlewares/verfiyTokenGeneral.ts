import { Response, Request, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { ADMIN_TOKEN, USER_TOKEN } from '../constants/constants';

const verifyTokenGeneral = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader === 'undefined' || null || '') {
    return res.status(403).json({ msg: 'Authorization is null.' });
  }
  const bearer = bearerHeader;
  jwt.verify(bearer, USER_TOKEN, (err, ver) => {
    if (err) {
      jwt.verify(bearer, ADMIN_TOKEN, (err, ver) => {
        if (err) {
          res.status(403).json({ msg: err });
        } else {
          next();
        }
      });
    } else {
      next();
    }
  });
};

export default verifyTokenGeneral;

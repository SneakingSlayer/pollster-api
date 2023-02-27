import { Response, Request, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

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
  jwt.verify(bearer, process.env.USER_TOKEN, (err, ver) => {
    if (err) {
      jwt.verify(bearer, process.env.ADMIN_TOKEN, (err, ver) => {
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
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

export const test = async (req: Request, res: Response) => {
  const data = {
    image: req.body.image,
  };
  const upload = await cloudinary.uploader.upload(data.image);
  res.status(200).json(upload);
};

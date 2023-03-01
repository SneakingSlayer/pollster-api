import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { ConnectionOptions } from 'tls';

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  MONGO_URI,
} from './constants/constants';

import indexRoute from './routes/index.routes';
import authRoute from './routes/auth.routes';
import pollsRoute from './routes/polls.routes';
import votesRoute from './routes/votes.routes';
import usersRoute from './routes/user.routes';
import searchRoute from './routes/search.routes';
import permissionsRoute from './routes/permission.routes';

const PORT = process.env.PORT || 6000;
const app = express();

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectionOptions,
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('MONGO CONNECTED');
    }
  }
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use(indexRoute);
app.use(authRoute);
app.use(pollsRoute);
app.use(votesRoute);
app.use(usersRoute);
app.use(searchRoute);
app.use(permissionsRoute);

app.listen(PORT, () => console.log('Server Connected at port ', PORT));

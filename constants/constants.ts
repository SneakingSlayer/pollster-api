import { config } from 'dotenv';

config();

export const MONGO_URI = process.env.MONGO_URI ?? '';
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? '';
export const USER_TOKEN = process.env.USER_TOKEN ?? '';
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME ?? '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? '';

export const ORGANIZATION = {
  name: 'MAPUA, Malayan Colleges of Mindanao',
  abbrv: 'MMCM',
};

export const ROLES = {
  student: 'student',
  admin: 'admin',
};

import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Welcome to Pollster!' });
});

export default router;

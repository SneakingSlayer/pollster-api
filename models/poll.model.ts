import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    votes: {
      type: String,
      required: true,
    },
    choices: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Poll = mongoose.model('Polls', pollSchema);

export default Poll;

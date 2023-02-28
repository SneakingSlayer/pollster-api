import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    poll_id: {
      type: String,
      required: true,
    },
    choice: {
      type: Object,
      required: true,
    },
    choice_description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    poster_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Vote = mongoose.model('Votes', voteSchema);

export default Vote;

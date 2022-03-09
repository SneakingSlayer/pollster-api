const router = require("express").Router();
const Poll = require("../models/Poll");
const User = require("../models/User");
const Vote = require("../models/Vote");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyTokenGeneral = require("../middlewares/verfiyTokenGeneral");

const cloudinary = require("cloudinary").v2;
//Get all polls
router.get("/polls", verifyTokenGeneral, async (req, res) => {
  try {
    //  const polls = await Poll.find();
    const polls = await Poll.aggregate([
      {
        $project: {
          choices: "$choices",
          date_created: "$date_created",
          description: "$description",
          firstname: "$firstname",
          lastname: "$lastname",
          title: "$title",
          votes: "$votes",
          user_id: "$user_id",
          img: "$img",
          totalVotes: {
            $sum: "$choices.votes",
          },
        },
      },
      { $sort: { date_created: -1 } },
    ]);
    res.status(200).json(polls);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//Get specific poll
router.get("/polls/:id", verifyTokenGeneral, async (req, res) => {
  try {
    let total = 0;
    const poll = await Poll.find({ _id: req.params.id });
    const voteMap = poll[0].choices.map((choice) => {
      total += parseInt(choice.votes);
    });

    res.status(200).json([
      {
        _id: poll[0]._id,
        choices: poll[0].choices,
        date_created: poll[0].date_created,
        description: poll[0].description,
        firstname: poll[0].firstname,
        lastname: poll[0].lastname,
        title: poll[0].title,
        votes: poll[0].votes,
        user_id: poll[0].user_id,
        img: poll[0].img,
        totalVotes: total,
      },
    ]);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//Create poll
router.post("/polls", async (req, res) => {
  const upload = await cloudinary.uploader.upload(req.body.img);
  if (!upload)
    return res
      .status(500)
      .json({ msg: "There was a problem with your request." });
  const user = await User.findOne({ _id: req.body.user_id });
  if (!user) return res.status(400).json({ msg: "No user found." });
  const poll = new Poll({
    firstname: user.firstname,
    lastname: user.lastname,
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.description,
    img: upload.url,
    votes: req.body.votes,
    choices: req.body.choices,
    date_created: Date.now(),
  });

  try {
    const savePoll = await poll.save();
    res.status(200).json({ msg: "Poll successfully posted." });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//Update vote count
router.put("/polls/:id", verifyTokenGeneral, async (req, res) => {
  const poll = await Poll.findOne({ _id: req.params.id });
  const currentCount = poll.choices.filter(
    (choice) => choice.idx === req.body.idx
  );
  const query = {
    _id: req.params.id,
    "choices.idx": req.body.idx,
  };
  const update = {
    $set: {
      "choices.$.votes": parseInt(currentCount[0].votes) + 1,
    },
  };

  try {
    const voteUpdate = await Poll.updateOne(query, update);
    res.status(200).json({ msg: "Votes successfully updated." });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//Delete a poll
router.delete("/polls/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletePoll = await Poll.deleteOne({ _id: id });
    const deleteVotes = await Vote.deleteMany({ poll_id: id });
    res.status(200).json({ msg: "Polls and votes successfully deleted." });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;

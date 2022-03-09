const router = require("express").Router();
const User = require("../models/User");
const Vote = require("../models/Vote");
const Poll = require("../models/Poll");
const Disabled = require("../models/Disabled");
const verifyTokenGeneral = require("../middlewares/verfiyTokenGeneral");
const ObjectId = require("mongodb").ObjectId;

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

router.get("/user/:id", verifyTokenGeneral, async (req, res) => {
  const id = req.params.id;
  try {
    const findUser = await User.find({ _id: id });
    res.status(200).json(findUser);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

router.get("/user/disable/:id", async (req, res) => {
  const id = req.params.id;
  const findUser = await User.find({ _id: id });
  if (!findUser) {
    res.status(404).json({ msg: "User not found." });
    return;
  }

  const findVotes = await Vote.find({ user_id: id });
  if (!findVotes) {
    res.status(404).json({ msg: "No votes found" });
    return;
  }

  let userPolls = [];
  for (let i = 0; i < findVotes.length; i++) {
    userPolls.push(findVotes[i].poll_id);
  }

  for (let j = 0; j < findVotes.length; j++) {
    const poll = await Poll.findOne({ _id: findVotes[j].poll_id });
    if (!poll) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    const currentCount = poll.choices.filter(
      (choice) => choice.idx === findVotes[j].choice
    );
    const query = {
      _id: findVotes[j].poll_id,
      "choices.idx": findVotes[j].choice,
    };
    const update = {
      $set: {
        "choices.$.votes": parseInt(currentCount[0].votes) - 1,
      },
    };

    console.log({ user_id: findVotes[j].user_id });

    try {
      const voteUpdate = await Poll.updateOne(query, update);
      const voteDelete = await Vote.deleteOne({
        user_id: findVotes[j].user_id,
      });
      console.log("ok");
    } catch (err) {
      res.status(400).json({ msg: "first error" });
      return;
    }
  }

  const user = new Disabled({
    firstname: findUser[0].firstname,
    lastname: findUser[0].lastname,
    email: findUser[0].email,
    username: findUser[0].username,
    organization: "MCM",
    role: "student",
    password: findUser[0].password,
    date_created: Date.now(),
  });

  try {
    const block = await user.save(user);
    const disable = await User.deleteOne({ _id: findUser[0]._id });
    res.status(200).json({ msg: "Successfully disabled user." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "last error", user: user });
  }
});

router.put("/user/permissions/assign", async (req, res) => {
  try {
    const findUser = await User.findOne({
      _id: new ObjectId(`${req.body.user_id}`),
    });
    const findPermission = await User.find({
      _id: req.body.user_id,
      permissions: { $in: [req.body.permission] },
    }).count();
    if (findPermission > 0)
      return res.status(200).json({ msg: "User has this permission." });
    const query = { _id: new ObjectId(`${req.body.user_id}`) };
    const addPermission = {
      $push: { permissions: req.body.permission },
    };
    try {
      const permission = await User.updateOne(query, addPermission);
      res.status(200).json({ msg: "Permission successfully added." });
    } catch (err) {
      res.status(400).json({ msg: "There was a problem with your request." });
    }
  } catch (err) {
    res.status(404).json({ msg: "No users found." });
  }
});

router.put("/user/permissions/unassign", async (req, res) => {
  try {
    const findUser = await User.findOne({
      _id: new ObjectId(`${req.body.user_id}`),
    });
    const findPermission = await User.find({
      _id: req.body.user_id,
      permissions: { $in: [req.body.permission] },
    }).count();
    if (!findPermission > 0)
      return res
        .status(200)
        .json({ msg: "User does not have this permission." });
    const query = { _id: new ObjectId(`${req.body.user_id}`) };
    const addPermission = {
      $pull: { permissions: req.body.permission },
    };
    try {
      const permission = await User.updateOne(query, addPermission);
      res.status(200).json({ msg: "Permission successfully removed." });
    } catch (err) {
      res.status(400).json({ msg: "There was a problem with your request." });
    }
  } catch (err) {
    res.status(404).json({ msg: "No users found." });
  }
});

module.exports = router;

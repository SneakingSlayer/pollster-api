const router = require("express").Router();
const Vote = require("../models/Vote");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Poll = require("../models/Poll");
const verifyTokenGeneral = require("../middlewares/verfiyTokenGeneral");
router.post("/votes", async (req, res) => {
  const addVote = new Vote({
    user_id: req.body.user_id,
    poll_id: req.body.poll_id,
    title: req.body.title,
    poster_name: req.body.poster_name,
    choice: req.body.choice,
    choice_description: req.body.choice_description,
    date_created: Date.now(),
  });
  try {
    const saveVote = await addVote.save();
    res.status(200).json({ msg: "Vote successfully added." });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

router.get("/votes/:id", verifyTokenGeneral, async (req, res) => {
  const id = req.params.id;
  try {
    const findVote = await Vote.find({ user_id: id });
    res.status(200).json(findVote);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;

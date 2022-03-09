const router = require("express").Router();
const Poll = require("../models/Poll");

router.get("/search/:query", async (req, res) => {
  try {
    const query = await Poll.find({
      title: { $regex: `.*${req.params.query}.*`, $options: "i" },
    });
    res.status(200).json(query);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;

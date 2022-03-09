const router = require("express").Router();

router.get("/", async (req, res) => {
  res.status(200).send({ message: "Welcome to Pollster!" });
});

module.exports = router;

const router = require("express").Router();
const Permissions = require("../models/Permission");

router.get("/permissions", async (req, res) => {
  try {
    const permissions = await Permissions.find();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

router.post("/permissions", async (req, res) => {
  const permission = new Permissions({
    permission: req.body.permission,
    name: req.body.name,
    date_created: Date.now(),
  });
  try {
    const newPermission = await permission.save();
    res.status(200).json({ msg: "Permission successfully added." });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

module.exports = router;

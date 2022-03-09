const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/auth/signin", async (req, res) => {
  const checkUsername = await User.findOne({ username: req.body.username });
  if (!checkUsername)
    return res.status(400).json({ status: 400, msg: "Incorrect username." });
  const checkPass = await bcrypt.compare(
    req.body.password,
    checkUsername.password
  );
  if (!checkPass)
    return res.status(400).json({ status: 400, msg: "Incorrect password." });

  if (checkUsername.role === "student") {
    const token = jwt.sign({ _id: checkUsername._id }, process.env.USER_TOKEN, {
      expiresIn: "3d",
    });
    res.header("token", token).json({
      token: token,
      role: checkUsername.role,
      id: checkUsername._id,
      permissions: checkUsername.permissions,
    });
  }
  if (checkUsername.role === "admin") {
    const token = jwt.sign(
      { _id: checkUsername._id },
      process.env.ADMIN_TOKEN,
      {
        expiresIn: "3d",
      }
    );
    res.header("token", token).json({
      token: token,
      role: checkUsername.role,
      id: checkUsername._id,
      permissions: checkUsername.permissions,
    });
  }
});

router.post("/auth/signup", async (req, res) => {
  console.log("triggered");
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);
  const checkEmail = await User.findOne({ email: req.body.email });
  const checkUsername = await User.findOne({ username: req.body.username });
  if (checkEmail)
    return res.status(400).json({ status: 400, msg: "Email already exists." });
  if (checkUsername)
    return res
      .status(400)
      .json({ status: 400, msg: "Username already exists." });

  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    organization: "MCM",
    role: "student",
    permissions: [],
    password: hashPass,
    date_created: Date.now(),
  });

  try {
    const savedUser = await user.save();
    res.status(200).json({
      status: 200,
      msg: `${req.body.username} successfully registered!`,
    });
  } catch (err) {
    console.log("error");
    res.status(400).json({ status: 400, msg: err });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  organization: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  permissions: {
    type: Array,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);

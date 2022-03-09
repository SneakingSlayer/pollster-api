const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Permissions", permissionSchema);

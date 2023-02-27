import mongoose from 'mongoose';

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

const Permission = mongoose.model('Permissions', permissionSchema);

export default Permission;

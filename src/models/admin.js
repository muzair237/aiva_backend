import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }],
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model('admin', adminSchema);

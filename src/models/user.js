import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: { type: mongoose.Types.ObjectId, ref: 'roles', required: true },
    DOB: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model('user', userSchema);

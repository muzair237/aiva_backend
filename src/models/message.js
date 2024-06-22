import mongoose, { Schema } from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    timeStamp: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('message', messageSchema);

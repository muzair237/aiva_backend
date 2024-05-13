import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    feedback: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model('feedback', feedbackSchema);

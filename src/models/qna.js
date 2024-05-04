import mongoose from 'mongoose';

const qnaSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('QnA', qnaSchema);

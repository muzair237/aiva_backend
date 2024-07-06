import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model('enquiry', enquirySchema);

import mongoose from 'mongoose';

const adminJWTSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: 'admin', required: true },
  token: { type: String, required: true },
  iat: { type: String },
  exp: { type: String },
});

export default mongoose.model('admin_jwt', adminJWTSchema);

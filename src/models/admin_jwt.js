import mongoose from 'mongoose';

const adminJWTSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: 'admin', required: true },
  token: { type: String, required: true },
  iat: { type: Date },
  exp: { type: Date },
});

export default mongoose.model('admin_jwt', adminJWTSchema);

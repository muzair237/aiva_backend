import mongoose from 'mongoose';

const userJWTSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  token: { type: String, required: true },
  iat: { type: Date },
  exp: { type: Date },
});

export default mongoose.model('user_jwt', userJWTSchema);

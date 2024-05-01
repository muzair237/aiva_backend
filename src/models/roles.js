import mongoose, { Schema } from 'mongoose';

const rolesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: {
      type: [Schema.Types.ObjectId],
      ref: 'permissions',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('roles', rolesSchema);

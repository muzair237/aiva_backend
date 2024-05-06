import mongoose from 'mongoose';

const permissionsSchema = new mongoose.Schema(
  {
    route: {
      type: String,
      required: true,
    },
    can: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    parent: {
      type: [String],
      required: true,
    },
    group: {
      type: String,
      enum: ['ADMIN', 'USER'],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('permissions', permissionsSchema);

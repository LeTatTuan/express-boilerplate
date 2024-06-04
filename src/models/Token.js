import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    accessTokens: [{ type: Object }],
    refreshToken: { type: String },
    ip: { type: String, default: '::1' },
    userAgent: {
      type: String,
      required: 'PostmanRuntime/7.39.0',
    },
    isValid: { type: Boolean, default: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('Token', tokenSchema);

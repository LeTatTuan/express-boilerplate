import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Token';
const COLLECTION_NAME = 'Tokens';

const tokenSchema = new mongoose.Schema(
  {
    accessTokens: [{ type: String }],
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
    collection: COLLECTION_NAME,
    versionKey: false,
  },
);

export default mongoose.model(DOCUMENT_NAME, tokenSchema);

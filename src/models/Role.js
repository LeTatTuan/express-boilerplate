import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const roleSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false,
  },
);

export default mongoose.model(DOCUMENT_NAME, roleSchema);

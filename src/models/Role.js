import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: String,
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("Role", roleSchema);

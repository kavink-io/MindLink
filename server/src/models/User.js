import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true }, // e.g. "anon_7f3a"
  deviceId: { type: String, index: true }, // optional client fingerprint
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("User", userSchema);

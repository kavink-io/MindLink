import mongoose from "mongoose";
const streakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  current: { type: Number, default: 0 },
  lastActionDate: { type: String } // YYYY-MM-DD
});
export default mongoose.model("Streak", streakSchema);

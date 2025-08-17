import mongoose from "mongoose";
const reportSchema = new mongoose.Schema({
  targetType: { type: String, enum: ["question", "answer"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export default mongoose.model("Report", reportSchema);

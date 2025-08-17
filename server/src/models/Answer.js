import mongoose from "mongoose";
const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: { type: String, required: true },
  upvotes: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model("Answer", answerSchema);

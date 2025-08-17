import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  body: { type: String, default: "" },
  tags: [String],
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model("Question", questionSchema);

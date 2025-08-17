import { Router } from "express";
import { z } from "zod";
import { requireUser } from "../middleware/auth.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Streak from "../models/Streak.js";

const r = Router();

const today = () => new Date().toISOString().slice(0,10);
const touchStreak = async (userId) => {
  const t = today();
  let s = await Streak.findOne({ user: userId });
  if (!s) return Streak.create({ user: userId, current: 1, lastActionDate: t });
  if (s.lastActionDate === t) return s;
  const last = new Date(s.lastActionDate);
  const diff = Math.round((new Date(t) - last) / 86400000);
  s.current = diff === 1 ? s.current + 1 : 1;
  s.lastActionDate = t;
  return s.save();
};

// list feed
r.get("/questions", async (req, res) => {
  const q = await Question.find().sort({ createdAt: -1 }).limit(50);
  res.json(q);
});

// create question
r.post("/questions", requireUser, async (req, res) => {
  const schema = z.object({ title: z.string().min(6), body: z.string().optional(), tags: z.array(z.string()).optional() });
  const data = schema.parse(req.body);
  const doc = await Question.create({ ...data, author: req.user._id });
  await touchStreak(req.user._id);
  res.status(201).json(doc);
});

// get one
r.get("/questions/:id", async (req, res) => {
  const q = await Question.findById(req.params.id);
  const a = await Answer.find({ question: q._id }).sort({ createdAt: -1 });
  res.json({ question: q, answers: a });
});

// answer
r.post("/questions/:id/answers", requireUser, async (req, res) => {
  const schema = z.object({ body: z.string().min(2) });
  const { body } = schema.parse(req.body);
  const a = await Answer.create({ question: req.params.id, author: req.user._id, body });
  await touchStreak(req.user._id);
  res.status(201).json(a);
});

export default r;

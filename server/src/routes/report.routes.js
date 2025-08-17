import { Router } from "express";
import { z } from "zod";
import { requireUser } from "../middleware/auth.js";
import Report from "../models/Report.js";
const r = Router();

r.post("/", requireUser, async (req, res) => {
  const schema = z.object({
    targetType: z.enum(["question", "answer"]),
    targetId: z.string(),
    reason: z.string().min(5)
  });
  const data = schema.parse(req.body);
  const report = await Report.create({ ...data, reporter: req.user._id });
  res.status(201).json(report);
});

export default r;

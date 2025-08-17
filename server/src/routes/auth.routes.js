import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const r = Router();

// create or reuse anon user by deviceId
r.post("/anon", async (req, res) => {
  const { deviceId } = req.body;
  let user = await User.findOne({ deviceId });
  if (!user) {
    const handle = "anon_" + Math.random().toString(16).slice(2, 6);
    user = await User.create({ handle, deviceId });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, handle: user.handle });
});

export default r;

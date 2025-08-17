import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireUser = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id);
    if (!req.user) return res.status(401).json({ message: "Invalid user" });
    next();
  } catch {
    res.status(401).json({ message: "Auth failed" });
  }
};

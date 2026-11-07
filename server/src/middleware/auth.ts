import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
}
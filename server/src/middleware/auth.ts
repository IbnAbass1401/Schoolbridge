import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type Role = "parent" | "student";

export interface AuthRequest extends Request {
  userId?: string;
  role?: Role;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role?: Role;
    };
    req.userId = payload.id;
    req.role = payload.role || "parent";
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
}

export function requireRole(role: Role) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.role !== role) {
      return res.status(403).json({ message: `Only ${role} accounts can do this` });
    }
    next();
  };
}
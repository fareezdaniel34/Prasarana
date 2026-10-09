import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

export interface AuthUser {
  id: number;
  username: string;
  role: "admin" | "operator";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, env.jwtSecret, { expiresIn: "12h" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload & AuthUser;
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please log in again" });
  }
}
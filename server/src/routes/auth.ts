import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getOne } from "../db.js";
import { requireAuth, signToken, type AuthUser } from "../auth.js";

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: AuthUser["role"];
}

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

const router = Router();

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const row = getOne<UserRow>(
    "SELECT id, username, password_hash, role FROM users WHERE username = ?",
    parsed.data.username,
  );
  if (!row || !bcrypt.compareSync(parsed.data.password, row.password_hash)) {
    res.status(401).json({ error: "Wrong username or password" });
    return;
  }

  const user: AuthUser = { id: row.id, username: row.username, role: row.role };
  res.json({ token: signToken(user), user });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
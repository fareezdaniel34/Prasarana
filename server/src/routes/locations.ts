import { Router } from "express";
import { getAll } from "../db.js";
import { requireAuth } from "../auth.js";

export interface Location {
  id: number;
  code: string;
  name: string;
  backgroundImage: string | null;
}

const router = Router();
router.use(requireAuth);

router.get("/", (_req, res) => {
  res.json(
    getAll<Location>(
      "SELECT id, code, name, background_image AS backgroundImage FROM locations ORDER BY id",
    ),
  );
});

export default router;
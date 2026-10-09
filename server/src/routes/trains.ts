import { Router } from "express";
import { z } from "zod";
import { getAll, getOne, run, transaction } from "../db.js";
import { requireAuth } from "../auth.js";

export interface Train {
  id: number;
  trainCode: string;
  locationId: number;
  locationCode: string;
  x: number;
  y: number;
  direction: "left" | "right";
  updatedAt: string;
  updatedBy: string | null;
}

const TRAIN_SELECT = `
  SELECT t.id, t.train_code AS trainCode, t.location_id AS locationId, l.code AS locationCode,
         t.x, t.y, t.direction, t.updated_at AS updatedAt, u.username AS updatedBy
  FROM trains t
  JOIN locations l ON l.id = t.location_id
  LEFT JOIN users u ON u.id = t.updated_by`;

const position = z.number().min(0).max(1);
const direction = z.enum(["left", "right"]);

const createSchema = z.object({
  trainCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{1,20}$/, "Train ID can only use letters, numbers and -, max 20 characters"),
  locationId: z.number().int().positive(),
  x: position.optional(),
  y: position.optional(),
  direction: direction.optional(),
});

const updateSchema = z
  .object({
    x: position.optional(),
    y: position.optional(),
    direction: direction.optional(),
    locationId: z.number().int().positive().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), { message: "Nothing to update" });

function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid data";
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function findTrain(id: number): Train | undefined {
  return getOne<Train>(`${TRAIN_SELECT} WHERE t.id = ?`, id);
}

function locationExists(id: number): boolean {
  return getOne<{ id: number }>("SELECT id FROM locations WHERE id = ?", id) !== undefined;
}

const router = Router();
router.use(requireAuth);

// GET /api/trains?location=AMGL
router.get("/", (req, res) => {
  const location = typeof req.query.location === "string" ? req.query.location : null;
  const trains = location
    ? getAll<Train>(`${TRAIN_SELECT} WHERE l.code = ? ORDER BY t.train_code`, location)
    : getAll<Train>(`${TRAIN_SELECT} ORDER BY t.train_code`);
  res.json(trains);
});

// POST /api/trains  { trainCode, locationId, x?, y?, direction? }
router.post("/", (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const { trainCode, locationId, x = 0.05, y = 0.05, direction = "right" } = parsed.data;

  if (!locationExists(locationId)) {
    res.status(404).json({ error: "Location not found" });
    return;
  }
  if (getOne("SELECT id FROM trains WHERE train_code = ?", trainCode)) {
    res.status(409).json({ error: `${trainCode} already exists` });
    return;
  }

  const { lastId } = run(
    "INSERT INTO trains (train_code, location_id, x, y, direction, updated_by) VALUES (?, ?, ?, ?, ?, ?)",
    trainCode, locationId, x, y, direction, req.user!.id,
  );
  res.status(201).json(findTrain(lastId));
});

// PATCH /api/trains/:id  { x?, y?, direction?, locationId? }  (called after drag / direction change)
router.patch("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid train id" });
    return;
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }

  const current = getOne<{ location_id: number; x: number; y: number; direction: string }>(
    "SELECT location_id, x, y, direction FROM trains WHERE id = ?",
    id,
  );
  if (!current) {
    res.status(404).json({ error: "Train not found" });
    return;
  }

  const next = {
    locationId: parsed.data.locationId ?? current.location_id,
    x: parsed.data.x ?? current.x,
    y: parsed.data.y ?? current.y,
    direction: parsed.data.direction ?? current.direction,
  };
  if (next.locationId !== current.location_id && !locationExists(next.locationId)) {
    res.status(404).json({ error: "Location not found" });
    return;
  }

  const userId = req.user!.id;
  transaction(() => {
    run(
      `UPDATE trains SET location_id = ?, x = ?, y = ?, direction = ?,
              updated_at = datetime('now'), updated_by = ?
       WHERE id = ?`,
      next.locationId, next.x, next.y, next.direction, userId, id,
    );
    run(
      `INSERT INTO train_movements
         (train_id, user_id, from_location_id, to_location_id, from_x, from_y, to_x, to_y, from_direction, to_direction)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, userId, current.location_id, next.locationId,
      current.x, current.y, next.x, next.y, current.direction, next.direction,
    );
  });

  res.json(findTrain(id));
});

// DELETE /api/trains/:id
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid train id" });
    return;
  }
  const { changes } = run("DELETE FROM trains WHERE id = ?", id);
  if (changes === 0) {
    res.status(404).json({ error: "Train not found" });
    return;
  }
  res.status(204).end();
});

// GET /api/trains/:id/movements  (last 50 moves)
router.get("/:id/movements", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid train id" });
    return;
  }
  res.json(
    getAll<Record<string, unknown>>(
      `SELECT m.id, m.moved_at AS movedAt, u.username AS movedBy,
              fl.code AS fromLocation, tl.code AS toLocation,
              m.from_x AS fromX, m.from_y AS fromY, m.to_x AS toX, m.to_y AS toY,
              m.from_direction AS fromDirection, m.to_direction AS toDirection
       FROM train_movements m
       LEFT JOIN users u ON u.id = m.user_id
       LEFT JOIN locations fl ON fl.id = m.from_location_id
       LEFT JOIN locations tl ON tl.id = m.to_location_id
       WHERE m.train_id = ?
       ORDER BY m.id DESC
       LIMIT 50`,
      id,
    ),
  );
});

export default router;
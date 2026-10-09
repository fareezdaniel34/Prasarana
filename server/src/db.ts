import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { env } from "./env.js";

mkdirSync(path.dirname(env.dbFile), { recursive: true });

export const db = new DatabaseSync(env.dbFile);

db.exec(`
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS locations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  code             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  background_image TEXT
);

CREATE TABLE IF NOT EXISTS trains (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  train_code  TEXT NOT NULL UNIQUE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  x           REAL NOT NULL DEFAULT 0.05 CHECK (x BETWEEN 0 AND 1),
  y           REAL NOT NULL DEFAULT 0.05 CHECK (y BETWEEN 0 AND 1),
  direction   TEXT NOT NULL DEFAULT 'right' CHECK (direction IN ('left', 'right')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by  INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS train_movements (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  train_id         INTEGER NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
  user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  from_location_id INTEGER REFERENCES locations(id),
  to_location_id   INTEGER REFERENCES locations(id),
  from_x REAL, from_y REAL, to_x REAL, to_y REAL,
  from_direction TEXT, to_direction TEXT,
  moved_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_trains_location ON trains(location_id);
CREATE INDEX IF NOT EXISTS idx_movements_train ON train_movements(train_id, moved_at);
`);

type Param = string | number | null;

export function getOne<T>(sql: string, ...params: Param[]): T | undefined {
  return db.prepare(sql).get(...params) as unknown as T | undefined;
}

export function getAll<T>(sql: string, ...params: Param[]): T[] {
  return db.prepare(sql).all(...params) as unknown as T[];
}

export function run(sql: string, ...params: Param[]) {
  const result = db.prepare(sql).run(...params);
  return { changes: Number(result.changes), lastId: Number(result.lastInsertRowid) };
}

export function transaction<T>(fn: () => T): T {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
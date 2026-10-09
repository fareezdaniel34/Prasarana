import { existsSync } from "node:fs";

if (existsSync(".env")) process.loadEnvFile(".env");

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in server/.env`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required("JWT_SECRET"),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  dbFile: process.env.DB_FILE ?? "data/prasarana.db",
};
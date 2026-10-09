import { env } from "./env.js";
import "./db.js";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/locations.js";
import trainRoutes from "./routes/trains.js";

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/trains", trainRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    typeof err === "object" && err !== null && "status" in err && typeof err.status === "number"
      ? err.status
      : 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Server error" : "Bad request" });
});

app.listen(env.port, () => {
  console.log(`Prasarana API running on http://localhost:${env.port}`);
});
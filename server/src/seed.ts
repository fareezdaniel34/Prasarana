import bcrypt from "bcryptjs";
import { getOne, run, transaction } from "./db.js";

const LOCATIONS = [
  { code: "AMGL", name: "Ampang Line", image: "ampang-line.png" },
  { code: "AMGD", name: "Ampang Depot", image: "ampang-depot.png" },
  { code: "KKSB", name: "KKSB Depot", image: "kksb-depot.png" },
];
const SAMPLE_TRAINS = ["TR01", "TR02", "TR03", "TR04", "TR05"];

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
if (!username || !password || password.length < 8) {
  console.error("Set ADMIN_USERNAME and ADMIN_PASSWORD (at least 8 characters) in server/.env");
  process.exit(1);
}

transaction(() => {
  for (const loc of LOCATIONS) {
    run(
      "INSERT OR IGNORE INTO locations (code, name, background_image) VALUES (?, ?, ?)",
      loc.code, loc.name, loc.image,
    );
  }

  if (getOne("SELECT id FROM users WHERE username = ?", username)) {
    console.log(`User "${username}" already exists, skipped`);
  } else {
    run(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')",
      username, bcrypt.hashSync(password, 10),
    );
    console.log(`Created admin user "${username}"`);
  }

  const ampangLine = getOne<{ id: number }>("SELECT id FROM locations WHERE code = 'AMGL'")!;
  SAMPLE_TRAINS.forEach((code, i) => {
    run(
      "INSERT OR IGNORE INTO trains (train_code, location_id, x, y) VALUES (?, ?, ?, ?)",
      code, ampangLine.id, 0.05 + i * 0.15, 0.1,
    );
  });
});

console.log("Seed done");
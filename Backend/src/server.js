import app from "./app.js";
import config from "./config.js";
import pool from "./db.js";

const server = app.listen(config.port, async () => {
  console.log(`Boarding.lk API running on http://localhost:${config.port}`);
  try {
    await pool.query("SELECT 1");
    console.log(`Connected to PostgreSQL database "${config.db.database}"`);
  } catch (err) {
    console.error("Could not connect to PostgreSQL:", err.message);
    console.error("Check the DB_* values in your .env file.");
  }
});

function shutdown() {
  server.close(() => pool.end().then(() => process.exit(0)));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

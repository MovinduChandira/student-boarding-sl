import pg from "pg";
import config from "./config.js";

const { connectionString, ...params } = config.db;

const pool = new pg.Pool(connectionString ? { connectionString } : params);

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err.message);
});

export const query = (text, values) => pool.query(text, values);

/**
 * Runs `work(client)` inside a transaction. Commits if it resolves,
 * rolls back if it throws.
 */
export async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export default pool;

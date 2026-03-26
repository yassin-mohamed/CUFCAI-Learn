const { Pool } = require("pg");
const { newDb } = require("pg-mem");
const env = require("./env");

const usePgMem = String(env.databaseUrl || "").startsWith("pgmem://");

let pool;
if (usePgMem) {
  const memoryDb = newDb({ autoCreateForeignKeyIndices: true });
  const memoryPg = memoryDb.adapters.createPg();
  pool = new memoryPg.Pool();
  console.log("Using in-memory PostgreSQL (pg-mem) for local testing.");
} else {
  const sslConfig =
    env.dbSslMode === "require" ? { rejectUnauthorized: false } : false;

  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: sslConfig,
  });
}

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query,
  withTransaction,
};

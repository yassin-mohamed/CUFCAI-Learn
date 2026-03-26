const fs = require("fs");
const path = require("path");
const db = require("../config/db");

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No SQL migrations found.");
    return;
  }

  for (const file of files) {
    const migrationPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(migrationPath, "utf8");
    console.log(`Running migration: ${file}`);
    await db.query(sql);
  }

  console.log("Migrations completed.");
}

runMigrations()
  .then(async () => {
    await db.pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Migration failed:", error);
    await db.pool.end();
    process.exit(1);
  });

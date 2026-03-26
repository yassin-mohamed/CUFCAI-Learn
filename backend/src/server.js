const fs = require("fs");
const path = require("path");
const app = require("./app");
const env = require("./config/env");
const db = require("./config/db");

async function runMigrationsForStartup() {
  const migrationsDir = path.join(__dirname, "db", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const migrationPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(migrationPath, "utf8");
    await db.query(sql);
  }
}

async function startServer() {
  await runMigrationsForStartup();
  await db.query("SELECT 1");
  app.listen(env.port, () => {
    console.log(`Server started on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});

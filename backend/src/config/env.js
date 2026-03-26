const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:4000",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/cufcai_learn",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-env",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
  cookieName: process.env.COOKIE_NAME || "cufcai_auth",
  lockoutAttempts: Number(process.env.LOCKOUT_ATTEMPTS || 5),
  lockoutMinutes: Number(process.env.LOCKOUT_MINUTES || 15),
  dbSslMode: process.env.DB_SSL_MODE || "disable",
};

module.exports = env;

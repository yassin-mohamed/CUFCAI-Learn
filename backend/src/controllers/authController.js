const env = require("../config/env");
const db = require("../config/db");
const { signAuthToken } = require("../utils/jwt");
const {
  hashPassword,
  verifyPassword,
  validatePasswordPolicy,
} = require("../utils/password");

function sanitizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function serializeUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    universityId: user.university_id,
  };
}

function setAuthCookie(res, token) {
  const isProduction = env.nodeEnv === "production";
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 2 * 60 * 60 * 1000,
    path: "/",
  });
}

async function register(req, res, next) {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = sanitizeEmail(req.body.email);
    const universityId = String(req.body.universityId || "").trim();
    const password = String(req.body.password || "");

    if (!fullName || !email || !universityId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const passwordPolicy = validatePasswordPolicy(password);
    if (!passwordPolicy.valid) {
      return res.status(400).json({
        success: false,
        message: passwordPolicy.errors.join(" "),
      });
    }

    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1 OR university_id = $2 LIMIT 1",
      [email, universityId],
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or university ID already exists.",
      });
    }

    const passwordHash = await hashPassword(password);
    const inserted = await db.query(
      `
        INSERT INTO users (full_name, email, university_id, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name, email, university_id
      `,
      [fullName, email, universityId, passwordHash],
    );

    const user = inserted.rows[0];
    const token = signAuthToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const result = await db.query(
      `
        SELECT id, full_name, email, university_id, password_hash, failed_attempts, lock_until
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [email],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];
    const now = new Date();

    if (user.lock_until && new Date(user.lock_until) > now) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked. Try again later.",
      });
    }

    const passwordOk = await verifyPassword(password, user.password_hash);
    if (!passwordOk) {
      const nextFailedAttempts = Number(user.failed_attempts || 0) + 1;
      let lockUntil = null;

      if (nextFailedAttempts >= env.lockoutAttempts) {
        lockUntil = new Date(now.getTime() + env.lockoutMinutes * 60 * 1000);
      }

      await db.query(
        `
          UPDATE users
          SET failed_attempts = $2,
              lock_until = $3,
              updated_at = NOW()
          WHERE id = $1
        `,
        [user.id, nextFailedAttempts, lockUntil],
      );

      const message =
        lockUntil !== null
          ? "Account locked due to multiple failed attempts. Please try again later."
          : "Invalid email or password.";

      return res.status(lockUntil ? 423 : 401).json({
        success: false,
        message,
      });
    }

    await db.query(
      `
        UPDATE users
        SET failed_attempts = 0,
            lock_until = NULL,
            updated_at = NOW()
        WHERE id = $1
      `,
      [user.id],
    );

    const token = signAuthToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

function logout(_req, res) {
  const isProduction = env.nodeEnv === "production";
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

async function me(req, res, next) {
  try {
    const result = await db.query(
      `
        SELECT id, full_name, email, university_id
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [req.auth.userId],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Session is no longer valid.",
      });
    }

    return res.status(200).json({
      success: true,
      user: serializeUser(result.rows[0]),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};

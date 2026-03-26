const bcrypt = require("bcryptjs");

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 12);
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function validatePasswordPolicy(password) {
  const value = String(password || "");
  const errors = [];

  if (value.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  if (!/[A-Z]/.test(value)) {
    errors.push("Password must include an uppercase letter.");
  }
  if (!/\d/.test(value)) {
    errors.push("Password must include a number.");
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push("Password must include a special character.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  validatePasswordPolicy,
};

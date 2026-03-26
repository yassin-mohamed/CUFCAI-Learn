const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const { requireAuth } = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const frontendRoot = path.join(__dirname, "..", "..");

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);

app.get("/dashboard.html", requireAuth, (_req, res) => {
  res.sendFile(path.join(frontendRoot, "dashboard.html"));
});

app.use(express.static(frontendRoot));

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendRoot, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

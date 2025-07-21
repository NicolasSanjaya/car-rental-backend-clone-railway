// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db.js"); // Impor pool untuk tes koneksi
const mainRouter = require("./routes/index.js"); // Impor router utama dari routes/index.js
const serverless = require("serverless-http");
const app = express();
const port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware Global
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://car-rental-web-weld.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tes Koneksi Database saat startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to Neon PostgreSQL database at:", res.rows[0].now);
  }
});

// Gunakan Router Utama
// Semua rute akan memiliki prefix /api
app.use("/", mainRouter);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

// Error Handling Middleware (Tempatkan di akhir)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server!",
    error: err.message,
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// module.exports = app;
// module.exports.handler = serverless(app);

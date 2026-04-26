require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

// ✅ FORCE CORS (no restrictions for now)
app.use(cors());

app.use(express.json());

// ✅ HANDLE PREFLIGHT EXPLICITLY (CRITICAL)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 🔥 THIS FIXES YOUR ERROR
  }

  next();
});

app.use(express.json());

// 🔥 DEBUG middleware (must add)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ✅ Routes
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/address", require("./routes/addressRoutes"))

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json(err.message);
  }
});


// ✅ Error handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR ❌", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
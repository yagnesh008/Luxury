const router = require("express").Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4)",
      [name, email, hashed, role]
    );

    res.json("User Registered");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email and password required");
    }

    console.log("EMAIL:", email);
    console.log("PASSWORD INPUT:", password);

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    console.log("DB RESULT:", result.rows); // 🔥

    if (result.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    const user = result.rows[0];

    console.log("USER OBJECT:", user); // 🔥
    console.log("DB PASSWORD:", user.password); // 🔥

    if (!user.password) {
      return res.status(500).json("Password missing in DB");
    }

    const valid = await bcrypt.compare(password, user.password);

    console.log("COMPARE RESULT:", valid); // 🔥

    if (!valid) {
      return res.status(400).json("Wrong password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "SECRET",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user.id,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err); // 🔥 MOST IMPORTANT
    res.status(500).json(err.message);
  }
});

module.exports = router;
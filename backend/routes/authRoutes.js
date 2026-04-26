const router = require("express").Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json("All fields are required");
    }

    // check existing user
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)",
      [name, email, hashedPassword, role || "user"]
    );

    res.json("User Registered");

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json("Server error");
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json("Email and password required");
    }

    // find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    const user = result.rows[0];

    if (!user.password) {
      return res.status(500).json("Password missing in DB");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json("Wrong password");
    }

    // generate token
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
    console.error("LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
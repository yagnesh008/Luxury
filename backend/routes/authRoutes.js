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
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(404).json("User not found");

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user.id,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
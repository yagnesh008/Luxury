const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ➕ Add Address
router.post("/", async (req, res) => {
  try {
    const { user_id, name, phone, city, pincode, address } = req.body;

    const result = await pool.query(
      `INSERT INTO addresses (user_id, name, phone, city, pincode, address_line)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, name, phone, city, pincode, address]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Address Insert Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get Addresses ✅ FIXED
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC",
      [userId]
    );

    res.json(result.rows); // ✅ return data
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ❌ Delete
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM addresses WHERE id=$1", [req.params.id]);
    res.send("Deleted");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ⭐ Set Default ✅ FIXED
router.put("/set-default/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    // remove old default
    await pool.query(
      "UPDATE addresses SET is_default = false WHERE user_id = $1",
      [user_id]
    );

    // set new default
    await pool.query(
      "UPDATE addresses SET is_default = true WHERE id = $1",
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("SET DEFAULT ERROR:", err);
    res.status(500).json({ error: "Failed to set default" });
  }
});

// ❌ Remove Default
router.put("/remove-default/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE addresses SET is_default = false WHERE id = $1",
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("REMOVE DEFAULT ERROR:", err);
    res.status(500).json({ error: "Failed to remove default" });
  }
});

module.exports = router;
const router = require("express").Router();
const pool = require("../config/db");

// ADD TO WISHLIST
router.post("/add", async (req, res) => {
  const { user_id, product_id } = req.body;

  await pool.query(
    "INSERT INTO wishlist (user_id, product_id) VALUES ($1,$2)",
    [user_id, product_id]
  );

  res.json("Added to wishlist");
});

// GET WISHLIST
router.get("/:user_id", async (req, res) => {
  const result = await pool.query(
    `SELECT p.* FROM wishlist w 
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id=$1`,
    [req.params.user_id]
  );

  res.json(result.rows);
});

module.exports = router;
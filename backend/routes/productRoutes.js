const router = require("express").Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let result;

    if (category) {
      result = await pool.query(
        "SELECT * FROM products WHERE category=$1",
        [category]
      );
    } else {
      result = await pool.query("SELECT * FROM products");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
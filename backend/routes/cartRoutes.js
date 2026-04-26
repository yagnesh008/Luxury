const router = require("express").Router();
const pool = require("../config/db");

// ✅ BASE URL (for images)
const BASE_URL =
  process.env.BASE_URL || "https://luxury-1.onrender.com";

// ✅ ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1,$2,$3)",
      [user_id, product_id, quantity]
    );

    res.json("Added to cart 💎");
  } catch (err) {
    console.error("CART ADD ERROR ❌", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET CART
router.get("/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        c.id,
        c.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      `,
      [req.params.user_id]
    );

    const data = result.rows.map((item) => ({
      ...item,
      image: item.image?.startsWith("http")
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`,
    }));

    res.json(data);
  } catch (err) {
    console.error("CART FETCH ERROR ❌", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔼 UPDATE QUANTITY
router.put("/update", async (req, res) => {
  try {
    const { cart_id, quantity } = req.body;

    await pool.query(
      "UPDATE cart SET quantity=$1 WHERE id=$2",
      [quantity, cart_id]
    );

    res.json("Quantity updated");
  } catch (err) {
    console.error("CART UPDATE ERROR ❌", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ❌ REMOVE ITEM
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart WHERE id=$1", [req.params.id]);
    res.json("Item removed");
  } catch (err) {
    console.error("CART DELETE ERROR ❌", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 CLEAR CART
router.delete("/clear/:userId", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM cart WHERE user_id = $1",
      [req.params.userId]
    );

    res.json({ message: "Cart cleared ✅" });
  } catch (err) {
    console.error("CART CLEAR ERROR ❌", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
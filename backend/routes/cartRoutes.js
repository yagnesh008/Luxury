const router = require("express").Router();
const pool = require("../config/db");

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
    console.error("CART ADD ERROR ❌", err);
    res.status(500).json(err.message);
  }
});

// ✅ GET CART (POSTGRES FIXED)
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

    // 🔥 FIX IMAGE PATH (IMPORTANT)
    const data = result.rows.map(item => ({
      ...item,
      image: item.image?.startsWith("http")
        ? item.image
        : `http://localhost:5000/uploads/${item.image}`
    }));

    res.json(data);
  } catch (err) {
    console.error("CART FETCH ERROR ❌", err);
    res.status(500).json(err.message);
  }
});

// 🔼 INCREASE / DECREASE QUANTITY
router.put("/update", async (req, res) => {
  const { cart_id, quantity } = req.body;

  try {
    await pool.query(
      "UPDATE cart SET quantity=$1 WHERE id=$2",
      [quantity, cart_id]
    );

    res.json("Quantity updated");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ❌ REMOVE ITEM
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart WHERE id=$1", [req.params.id]);
    res.json("Item removed");
  } catch (err) {
    res.status(500).json(err.message);
  }
});
// 🔥 CLEAR CART AFTER PAYMENT 
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await pool.query(
      "DELETE FROM cart WHERE user_id = $1",
      [userId]
    );

    res.status(200).json({ message: "Cart cleared ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});
module.exports = router;
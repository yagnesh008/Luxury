const router = require("express").Router();
const pool = require("../config/db");
const { verifyToken } = require("../middleware/auth");


// 📦 CREATE ORDER (FIXED)
router.post("/create", async (req, res) => {
  const { user_id, items, total, address, payment_id } = req.body;

  try {
    // ✅ Create order
    const orderRes = await pool.query(
      `INSERT INTO orders 
       (user_id, total, status, address, payment_id) 
       VALUES ($1,$2,$3,$4,$5) 
       RETURNING id`,
      [user_id, total, "placed", JSON.stringify(address), payment_id]
    );

    const order_id = orderRes.rows[0].id;

    // ✅ Insert items
    for (let item of items) {
      await pool.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price) 
         VALUES ($1,$2,$3,$4)`,
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    res.json({ success: true, order_id });

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});


// 📦 GET USER ORDERS (FIXED)
router.get("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const ordersRes = await pool.query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    const result = [];

    for (let order of ordersRes.rows) {
      const itemsRes = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [order.id]
      );

      result.push({
        ...order,
        items: itemsRes.rows
      });
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch orders");
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );

    const result = [];

    for (let order of orders.rows) {
      const items = await pool.query(
        `SELECT oi.*, p.name, p.image_url 
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      result.push({
        ...order,
        items: items.rows
      });
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// 🔄 UPDATE STATUS (ADMIN)
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  try {
    await pool.query(
      "UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2",
      [status, req.params.id]
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json(err.message);
  }
});


module.exports = router;
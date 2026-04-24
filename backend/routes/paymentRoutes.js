const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

// ✅ Safe Razorpay initialization (no crash)
let razorpay;

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ Razorpay keys missing. Payment disabled.");
} else {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// ✅ Create Order
router.post("/pay", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    // ✅ Check Razorpay instance
    if (!razorpay) {
      return res.status(500).json({
        error: "Razorpay not initialized ❌",
      });
    }

    let { amount } = req.body;

    // ✅ Strong validation
    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount ❌",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // ✅ always integer
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    console.log("ORDER OPTIONS:", options);

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (err) {
    console.error("🔥 PAYMENT ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

// ✅ Verify Payment
router.post("/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: "Payment verified ✅",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature ❌",
      });
    }

  } catch (err) {
    console.error("VERIFY ERROR ❌", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
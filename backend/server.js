// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // for webhooks / OpenAI http calls if desired

const app = express();
app.use(cors());
app.use(express.json());

// --- Simple in-memory datastore (fallback) ---
let PRODUCTS = [
  { id: 1, name: "Tshirt", price: 15, image: "11.jpg" },
  { id: 2, name: "Smart Coffee Maker", price: 25, image: "12.jpg" },
  { id: 3, name: "E-book", price: 60, image: "13.jpg" },
  { id: 4, name: "Wireless Mouse", price: 30, image: "14.jpg" },
  { id: 5, name: "Power Bank", price: 15, image: "15.jpg" },
  { id: 6, name: "Cap", price: 10, image: "16.jpg" },
  { id: 7, name: "Backpack", price: 40, image: "17.jpg" },
  { id: 8, name: "USB Drive 32GB", price: 12, image: "18.jpg" },
  { id: 9, name: "USB Drive 64GB", price: 20, image: "19.jpg" }
];

let ORDERS = []; // in-memory orders for quick testing

// --- Optional MongoDB support (only if MONGODB_URI is set) ---
const useMongo = !!process.env.MONGODB_URI;
let OrdersModel = null;
let mongoose = null;
if (useMongo) {
  mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error', err));

  const OrderSchema = new mongoose.Schema({
    items: Array,
    total: Number,
    customer: Object,
    createdAt: { type: Date, default: Date.now }
  });
  OrdersModel = mongoose.model('Order', OrderSchema);
}

// --- Routes ---

// Health
app.get('/', (req, res) => res.json({ status: 'ok' }));

// Products (frontend should fetch from backend)
app.get('/products', (req, res) => {
  res.json(PRODUCTS);
});

// Checkout: receive cart + customer info -> store order -> call automation webhook -> optional AI
app.post('/checkout', async (req, res) => {
  try {
    const { items = [], customer = {} } = req.body;
    const total = items.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);

    // Save order (Mongo or in-memory)
    let savedOrder;
    if (useMongo && OrdersModel) {
      savedOrder = await OrdersModel.create({ items, total, customer });
    } else {
      savedOrder = { id: ORDERS.length + 1, items, total, customer, createdAt: new Date() };
      ORDERS.push(savedOrder);
    }

    // Send to Zapier/Make webhook if provided
    if (process.env.ORDER_WEBHOOK_URL) {
      try {
        await fetch(process.env.ORDER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: savedOrder })
        });
      } catch (err) {
        console.warn('Webhook call failed:', err.message);
      }
    }

    // Optional AI: generate a short confirmation message using OpenAI (if key provided)
    let aiMessage = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `Create a short friendly order confirmation message for an order total $${total} with ${items.length} items.`;
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150
          })
        });
        const openaiData = await openaiRes.json();
        aiMessage = openaiData?.choices?.[0]?.message?.content || null;
      } catch (err) {
        console.warn('OpenAI call failed:', err.message);
      }
    }

    res.json({ success: true, order: savedOrder, aiMessage });
  } catch (err) {
    console.error('Checkout error', err);
    res.status(500).json({ error: 'checkout_failed', details: err.message });
  }
});

// Optional: get orders (admin)
app.get('/orders', async (req, res) => {
  try {
    if (useMongo && OrdersModel) {
      const list = await OrdersModel.find().sort({ createdAt: -1 });
      res.json(list);
    } else {
      res.json(ORDERS);
    }
  } catch (err) {
    console.error('Orders fetch error', err);
    res.status(500).json({ error: 'orders_failed', details: err.message });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

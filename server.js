import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static art images for all categories
app.use("/arts", express.static(path.join(process.cwd(), "arts")));

// Dynamic loader: scan /arts directory for PNGs in each category
function loadArtsData() {
  const artsDir = path.join(process.cwd(), "arts");
  if (!fs.existsSync(artsDir)) return [];
  const categories = fs.readdirSync(artsDir)
    .filter(f => fs.statSync(path.join(artsDir, f)).isDirectory());
  let arts = [];
  categories.forEach(category => {
    const catDir = path.join(artsDir, category);
    fs.readdirSync(catDir).forEach(file => {
      if (file.endsWith(".png")) {
        const match = file.match(/^(.+?)(\d+)\.png$/i);
        if (match) {
          const name = match[1];
          const price = Number(match[2]);
          arts.push({
            category,
            name,
            price,
            file: `/arts/${category}/${file}`,
          });
        }
      }
    });
  });
  return arts;
}

// In-memory transaction record (for demo/testing)
const paidTxnIds = new Set();

// Health check route
app.get("/", (req, res) => {
  res.send("Artify Backend is Live ✅");
});

// API: List all available arts dynamically
app.get("/api/arts", (req, res) => {
  res.json(loadArtsData());
});

// API: Payment provider webhook (adjust field names as per provider/docs)
app.post("/api/payment-webhook", (req, res) => {
  const { txnId, status } = req.body;
  if (status === "success") {
    paidTxnIds.add(txnId);
  }
  res.status(200).send("OK");
});

// API: Verify payment and send download link
app.post("/api/submit-payment", (req, res) => {
  const { txnId } = req.body;
  if (paidTxnIds.has(txnId)) {
    // Sample: send a fixed link. For your real store, generate a link per user/cart.
    res.json({
      success: true,
      downloadUrl: "/arts/AnimeArts/Feather5.png"
    });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Serve /arts as static files
app.use("/arts", express.static(path.join(process.cwd(), "arts")));

// Scan the arts directory and build arts list dynamically
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

// In-memory paid transaction record (demo/testing only)
const paidTxnIds = new Set();

// Health check route
app.get("/", (req, res) => {
  res.send("Artify Backend is Live ✅");
});

// API: Dynamic arts data (all files auto-detected)
app.get("/api/arts", (req, res) => {
  res.json(loadArtsData());
});

// API: Payment provider webhook (adjust payload fields if needed)
app.post("/api/payment-webhook", (req, res) => {
  const { txnId, status } = req.body;
  if (status === "success") {
    paidTxnIds.add(txnId);
  }
  res.status(200).send("OK");
});

// API: Verify payment (frontend POSTs txnId for download)
app.post("/api/submit-payment", (req, res) => {
  const { txnId } = req.body;
  if (paidTxnIds.has(txnId)) {
    res.json({
      success: true,
      downloadUrl: "/arts/AnimeArts/Feather5.png" // Replace for real user/case
    });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

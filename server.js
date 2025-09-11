import fs from "fs";
import path from "path";
<<<<<<< HEAD
import express from "express";
=======
>>>>>>> bfee767 (Update from Termux)
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Serve static arts
app.use("/arts", express.static(path.join(process.cwd(), "arts")));

// Util: Scan all .png in arts/{category}/
function loadArtsData() {
  const artsDir = path.join(process.cwd(), "arts");
  const categories = fs.readdirSync(artsDir).filter(f =>
    fs.statSync(path.join(artsDir, f)).isDirectory()
  );
=======
// Serve /arts as static files
app.use("/arts", express.static(path.join(process.cwd(), "arts")));

// Utility: Scan /arts/ directory to build current arts catalog
function loadArtsData() {
  const artsDir = path.join(process.cwd(), "arts");
  if (!fs.existsSync(artsDir)) return [];
  const categories = fs.readdirSync(artsDir)
    .filter(f => fs.statSync(path.join(artsDir, f)).isDirectory());
>>>>>>> bfee767 (Update from Termux)
  let arts = [];
  categories.forEach(category => {
    const catDir = path.join(artsDir, category);
    fs.readdirSync(catDir).forEach(file => {
      if (file.endsWith(".png")) {
<<<<<<< HEAD
        // Example: Feather5.png
        const match = file.match(/^(.+?)(\d+)\.png$/);
=======
        const match = file.match(/^(.+?)(\d+)\.png$/i);
>>>>>>> bfee767 (Update from Termux)
        if (match) {
          const name = match[1];
          const price = Number(match[2]);
          arts.push({
            category,
            name,
            price,
<<<<<<< HEAD
            file: `/arts/${category}/${file}`
=======
            file: `/arts/${category}/${file}`,
>>>>>>> bfee767 (Update from Termux)
          });
        }
      }
    });
  });
  return arts;
}

<<<<<<< HEAD
// API: Always provides up-to-date arts info
app.get("/api/arts", (req, res) => {
  const arts = loadArtsData();
  res.json(arts);
});

// ...rest of your routes...
=======
// In-memory paid transaction record (for demo/testing)
const paidTxnIds = new Set();

// Backend health check route
app.get("/", (req, res) => {
  res.send("Artify Backend is Live ✅");
});

// API: List all available arts dynamically
app.get("/api/arts", (req, res) => {
  res.json(loadArtsData());
});

// API: Payment provider webhook endpoint (update logic as needed for your provider)
app.post("/api/payment-webhook", (req, res) => {
  const { txnId, status } = req.body; // These field names must match your provider
  if (status === "success") {
    paidTxnIds.add(txnId);
  }
  res.status(200).send("OK");
});

// API: Frontend payment confirmation by user Txn ID
app.post("/api/submit-payment", (req, res) => {
  const { txnId } = req.body;
  if (paidTxnIds.has(txnId)) {
    // For complete implementation, generate per-user temp link for their purchased files
    // Here, just send a sample file download (replace with your logic)
    res.json({
      success: true,
      downloadUrl: "/arts/AnimeArts/Feather5.png"
    });
  } else {
    res.json({ success: false });
  }
});
>>>>>>> bfee767 (Update from Termux)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

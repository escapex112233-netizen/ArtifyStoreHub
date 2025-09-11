import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --- Root route for Render ---
app.get("/", (req, res) => {
  res.send("Artify Backend is Live ✅");
});

// --- Serve arts folder static ---
app.use("/arts", express.static(path.join(process.cwd(), "arts")));

// --- Load arts.json ---
const ARTS_FILE = path.join(process.cwd(), "arts.json");
let artsData = [];
if (fs.existsSync(ARTS_FILE)) {
  try {
    artsData = JSON.parse(fs.readFileSync(ARTS_FILE, "utf8"));
  } catch (err) {
    console.error("Error parsing arts.json:", err);
  }
}

// --- Temporary download storage ---
const tempLinks = {}; // { token: { file, expires } }

// --- API: Get all arts ---
app.get("/api/arts", (req, res) => {
  res.json(artsData);
});

// --- API: Generate temporary download link ---
app.post("/api/generate-link", (req, res) => {
  const { file } = req.body;
  if (!file) return res.status(400).json({ error: "File required" });

  const token = crypto.randomBytes(16).toString("hex");
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  tempLinks[token] = { file, expires };

  res.json({ url: `/download/${token}`, expires });
});

// --- Route: Serve download ---
app.get("/download/:token", (req, res) => {
  const { token } = req.params;
  const entry = tempLinks[token];

  if (!entry) return res.status(404).send("Invalid or expired link");
  if (Date.now() > entry.expires) {
    delete tempLinks[token];
    return res.status(410).send("Link expired");
  }

  const filePath = path.join(process.cwd(), entry.file.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  res.download(filePath, path.basename(filePath));
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

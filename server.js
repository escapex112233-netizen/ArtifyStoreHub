import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static arts
app.use("/arts", express.static(path.join(process.cwd(), "arts")));

// Util: Scan all .png in arts/{category}/
function loadArtsData() {
  const artsDir = path.join(process.cwd(), "arts");
  const categories = fs.readdirSync(artsDir).filter(f =>
    fs.statSync(path.join(artsDir, f)).isDirectory()
  );
  let arts = [];
  categories.forEach(category => {
    const catDir = path.join(artsDir, category);
    fs.readdirSync(catDir).forEach(file => {
      if (file.endsWith(".png")) {
        // Example: Feather5.png
        const match = file.match(/^(.+?)(\d+)\.png$/);
        if (match) {
          const name = match[1];
          const price = Number(match[2]);
          arts.push({
            category,
            name,
            price,
            file: `/arts/${category}/${file}`
          });
        }
      }
    });
  });
  return arts;
}

// API: Always provides up-to-date arts info
app.get("/api/arts", (req, res) => {
  const arts = loadArtsData();
  res.json(arts);
});

// ...rest of your routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

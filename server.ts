import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "projects.json");

// Middleware to handle JSON payloads with base64 images
app.use(express.json({ limit: "15mb" }));

// Seed projects file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
}

// 1. GET /api/projects - Retrieve dynamic projects from the server
app.get("/api/projects", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const projects = JSON.parse(data);
    res.json(projects);
  } catch (error) {
    console.error("Error reading projects database:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// 2. POST /api/projects - Add a new engineering project
app.post("/api/projects", (req, res) => {
  try {
    const { title, subtitle, category, scale, description, method, material, outcome, image, glb } = req.body;
    
    if (!title || !subtitle || !category || !scale || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProject = {
      id: "proj-" + Date.now(),
      title,
      subtitle,
      category,
      scale,
      description,
      method: method || "",
      material: material || "",
      outcome: outcome || "",
      image: image || null,
      glb: glb || null,
      timestamp: Date.now()
    };

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const projects = JSON.parse(data);
    projects.push(newProject);
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error saving engineering project:", error);
    res.status(500).json({ error: "Failed to persist project" });
  }
});

// Setup Vite Development Middleware or Static Files Production Server
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to boot the fullstack server:", err);
});

import express from "express";
import path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file before other imports
dotenv.config();

import { createServer as createViteServer } from "vite";
import { getProjects, createProject, deleteProject } from "./src/db/queries.ts";

const app = express();
const PORT = 3000;

// Middleware to handle JSON payloads with base64 images
app.use(express.json({ limit: "15mb" }));

// 1. GET /api/projects - Retrieve dynamic projects from Cloud SQL database
app.get("/api/projects", async (req, res) => {
  try {
    const projectsList = await getProjects();
    res.json(projectsList);
  } catch (error: any) {
    console.error("Error reading projects from database:", error);
    res.status(500).json({ error: error.message || "Failed to fetch projects" });
  }
});

// 2. POST /api/projects - Add a new engineering project to Cloud SQL database
app.post("/api/projects", async (req, res) => {
  try {
    const { title, subtitle, category, scale, description, method, material, outcome, image, glb } = req.body;
    
    if (!title || !subtitle || !category || !scale || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const projectId = "proj-" + Date.now();
    const newProject = await createProject({
      id: projectId,
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
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("Error saving engineering project:", error);
    res.status(500).json({ error: error.message || "Failed to persist project" });
  }
});

// 3. DELETE /api/projects/:id - Remove an engineering project
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProject(id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: error.message || "Failed to delete project" });
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

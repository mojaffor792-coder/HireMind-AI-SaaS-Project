import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(process.cwd(), "database.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simple JSON Database setup
  const initDb = async () => {
    try {
      await fs.access(DB_PATH);
    } catch {
      const initialData = {
        users: {
          "default-user": {
            id: "default-user",
            email: "user@example.com",
            plan: "Free",
            last_payment_date: null
          }
        }
      };
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
    }
  };

  await initDb();

  const getDb = async () => {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  };

  const saveDb = async (data: any) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  };

  app.use(express.json());

  // API Routes
  app.get("/api/user", async (req, res) => {
    const db = await getDb();
    res.json(db.users["default-user"]);
  });

  app.post("/api/upgrade", async (req, res) => {
    const { plan } = req.body;
    const validPlans = ["Starter", "Growth", "Pro", "Enterprise"];
    
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    res.json({ success: true, message: `Plan ${plan} selected` });
  });

  app.post("/api/activate-plan", async (req, res) => {
    const { plan } = req.body;
    const db = await getDb();
    db.users["default-user"].plan = plan;
    db.users["default-user"].last_payment_date = new Date().toISOString();
    await saveDb(db);
    res.json({ success: true, plan });
  });

  // Vite middleware for development
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

startServer();

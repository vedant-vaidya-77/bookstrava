import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined!");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API: Ask System Architect
app.post("/api/ask-architect", async (req, res) => {
  const { question, history, systemVariables } = req.body;

  if (!question) {
    res.status(400).json({ error: "Question parameter is required" });
    return;
  }

  try {
    const systemInstruction = `You are a Principal Systems Architect specializing in social software and mobile engineering. You are advising a developer building "Bookstrava" — a high-scale, modern "Strava for books" platform that tracks reading progress for physical, digital, and audiobooks, with a rich activity feed and social features.

The current user settings they are testing are:
- Platform Choice: ${systemVariables?.platform || "Not selected yet"}
- Database Selection: ${systemVariables?.database || "PostgreSQL / Firebase"}
- Sync Policy: ${systemVariables?.syncPolicy || "Standard HTTP REST"}

Your task is to provide extremely professional, insightful, and comprehensive answers. Address the trade-offs of their decisions, explain technical hurdles like digital percent-to-page interpolation, high-volume follower feed fanout-on-write, and offline logs reconciliation.
Keep explanations clear, highly structured, structured as bullet-points or short paragraphs, and direct. Offer solid tech recommendations (e.g., Redis, Room/WatermelonDB, SQLite, CRDTs, Firestore). Speak in a helpful, expert, and composed tone.`;

    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: question }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const answer = response.text || "I was unable to formulate an answer. Let's try restructuring your query.";
    res.json({ answer });

  } catch (err: any) {
    console.error("Gemini Architect API Error:", err);
    res.status(500).json({ 
      error: "An error occurred while contacting the system architect.", 
      details: err?.message || String(err)
    });
  }
});

// Setup Vite Dev Server / Prod Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});

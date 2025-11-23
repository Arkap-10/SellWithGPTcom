import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrialSignupSchema } from "@shared/schema";
import { storageClient } from "./storage-client";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/trial-signup", async (req, res) => {
    try {
      const validatedData = insertTrialSignupSchema.parse(req.body);
      
      const existingSignup = await storage.getTrialSignupByEmail(validatedData.email);
      if (existingSignup) {
        return res.status(409).json({ 
          error: "Email already registered for trial" 
        });
      }

      const signup = await storage.createTrialSignup(validatedData);
      
      return res.status(201).json({
        success: true,
        message: "Trial signup successful",
        signup: {
          id: signup.id,
          email: signup.email,
          planName: signup.planName,
          cardMasked: signup.cardMasked,
          createdAt: signup.createdAt,
        }
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        console.error("Validation error details:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Trial signup error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/trial-signups", async (req, res) => {
    try {
      const signups = await storage.getAllTrialSignups();
      return res.json({
        count: signups.length,
        signups: signups.map(s => ({
          id: s.id,
          email: s.email,
          planName: s.planName,
          cardProvided: s.cardProvided,
          cardMasked: s.cardMasked,
          createdAt: s.createdAt,
        }))
      });
    } catch (error) {
      console.error("Error fetching signups:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/video/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      
      const existsResult = await storageClient.exists(filename);
      if (!existsResult.ok || !existsResult.value) {
        return res.status(404).json({ error: "Video not found" });
      }

      // For proper Safari/iOS support, we need to download as bytes to handle range requests
      const downloadResult = await storageClient.downloadAsBytes(filename);
      if (!downloadResult.ok) {
        console.error("Error downloading video:", downloadResult.error);
        return res.status(500).json({ error: "Failed to retrieve video" });
      }

      const videoBuffer = downloadResult.value;
      const fileSize = videoBuffer.length;
      const range = req.headers.range;

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');

      if (range) {
        // Parse range header (e.g., "bytes=0-1023")
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        res.status(206); // Partial Content
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', chunkSize);
        
        const chunk = videoBuffer.slice(start, end + 1);
        res.end(chunk);
      } else {
        // Send entire file
        res.setHeader('Content-Length', fileSize);
        res.end(videoBuffer);
      }
    } catch (error) {
      console.error("Video streaming error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

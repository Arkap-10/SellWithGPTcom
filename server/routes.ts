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
          magentoVersion: signup.magentoVersion,
          monthlyOrders: signup.monthlyOrders,
          integrationTimeline: signup.integrationTimeline,
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
          magentoVersion: s.magentoVersion,
          monthlyOrders: s.monthlyOrders,
          integrationTimeline: s.integrationTimeline,
          createdAt: s.createdAt,
        }))
      });
    } catch (error) {
      console.error("Error fetching signups:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // CORS preflight handler for video endpoint
  app.options("/api/video/:filename", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
  });

  app.get("/api/video/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Set CORS headers for iOS Safari and cross-origin requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
      
      const existsResult = await storageClient.exists(filename);
      if (!existsResult.ok || !existsResult.value) {
        return res.status(404).json({ error: "Video not found" });
      }

      const stream = await storageClient.downloadAsStream(filename);
      
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      
      stream.on('error', (error) => {
        console.error("Stream error:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to stream video" });
        }
      });
      
      stream.pipe(res);
    } catch (error) {
      console.error("Video streaming error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

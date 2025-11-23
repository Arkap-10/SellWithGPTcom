import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrialSignupSchema } from "@shared/schema";
import { gcsBucket } from "./storage-client";

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
      const file = gcsBucket.file(filename);
      
      // Get file metadata
      const [metadata] = await file.getMetadata();
      const fileSize = parseInt(metadata.size);
      
      const range = req.headers.range;
      
      // Handle HEAD requests
      if (req.method === 'HEAD') {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes'
        });
        return res.end();
      }
      
      // Handle range requests (Safari requires this)
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        // Validate range
        if (start >= fileSize || end >= fileSize) {
          res.writeHead(416, {
            'Content-Range': `bytes */${fileSize}`
          });
          return res.end();
        }
        
        const chunkSize = (end - start) + 1;
        
        // Create read stream with range
        const stream = file.createReadStream({
          start,
          end
        });
        
        // 206 Partial Content response
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4'
        });
        
        stream.on('error', (error) => {
          console.error("Stream error:", error);
          if (!res.headersSent) {
            res.status(500).json({ error: "Failed to stream video" });
          }
        });
        
        stream.pipe(res);
      } else {
        // No range request - send full file
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes'
        });
        
        const stream = file.createReadStream();
        
        stream.on('error', (error) => {
          console.error("Stream error:", error);
          if (!res.headersSent) {
            res.status(500).json({ error: "Failed to stream video" });
          }
        });
        
        stream.pipe(res);
      }
    } catch (error: any) {
      console.error("Video streaming error:", error);
      if (error.code === 404) {
        return res.status(404).json({ error: "Video not found" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

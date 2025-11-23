import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrialSignupSchema } from "@shared/schema";

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
          createdAt: signup.createdAt,
        }
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
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
          createdAt: s.createdAt,
        }))
      });
    } catch (error) {
      console.error("Error fetching signups:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

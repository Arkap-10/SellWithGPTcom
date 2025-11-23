import { type TrialSignup, type InsertTrialSignup, trialSignups } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTrialSignupByEmail(email: string): Promise<TrialSignup | undefined>;
  createTrialSignup(signup: InsertTrialSignup): Promise<TrialSignup>;
  getAllTrialSignups(): Promise<TrialSignup[]>;
}

export class DatabaseStorage implements IStorage {
  async getTrialSignupByEmail(email: string): Promise<TrialSignup | undefined> {
    const results = await db
      .select()
      .from(trialSignups)
      .where(eq(trialSignups.email, email))
      .limit(1);
    
    return results[0];
  }

  async createTrialSignup(insertSignup: InsertTrialSignup): Promise<TrialSignup> {
    const results = await db
      .insert(trialSignups)
      .values(insertSignup)
      .returning();
    
    return results[0];
  }

  async getAllTrialSignups(): Promise<TrialSignup[]> {
    return await db.select().from(trialSignups);
  }
}

export const storage = new DatabaseStorage();

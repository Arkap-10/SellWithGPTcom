import { type TrialSignup, type InsertTrialSignup } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTrialSignupByEmail(email: string): Promise<TrialSignup | undefined>;
  createTrialSignup(signup: InsertTrialSignup): Promise<TrialSignup>;
  getAllTrialSignups(): Promise<TrialSignup[]>;
}

export class MemStorage implements IStorage {
  private trialSignups: Map<string, TrialSignup>;

  constructor() {
    this.trialSignups = new Map();
  }

  async getTrialSignupByEmail(email: string): Promise<TrialSignup | undefined> {
    return Array.from(this.trialSignups.values()).find(
      (signup) => signup.email === email,
    );
  }

  async createTrialSignup(insertSignup: InsertTrialSignup): Promise<TrialSignup> {
    const id = randomUUID();
    const signup: TrialSignup = {
      id,
      email: insertSignup.email,
      password: insertSignup.password,
      planName: insertSignup.planName || "Growth",
      cardProvided: insertSignup.cardProvided || false,
      createdAt: new Date(),
    };
    this.trialSignups.set(id, signup);
    return signup;
  }

  async getAllTrialSignups(): Promise<TrialSignup[]> {
    return Array.from(this.trialSignups.values());
  }
}

export const storage = new MemStorage();

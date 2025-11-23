import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trialSignups = pgTable("trial_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  companyName: text("company_name"),
  phone: text("phone"),
  planName: text("plan_name").notNull().default("Growth"),
  cardProvided: boolean("card_provided").notNull().default(false),
  cardMasked: text("card_masked"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrialSignupSchema = createInsertSchema(trialSignups).pick({
  email: true,
  fullName: true,
  companyName: true,
  phone: true,
  planName: true,
  cardProvided: true,
  cardMasked: true,
}).extend({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  cardMasked: z.string().optional(),
});

export type InsertTrialSignup = z.infer<typeof insertTrialSignupSchema>;
export type TrialSignup = typeof trialSignups.$inferSelect;

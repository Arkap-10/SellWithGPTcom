import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trialSignups = pgTable("trial_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  planName: text("plan_name").notNull().default("Growth"),
  cardProvided: boolean("card_provided").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrialSignupSchema = createInsertSchema(trialSignups).pick({
  email: true,
  password: true,
  planName: true,
  cardProvided: true,
}).extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type InsertTrialSignup = z.infer<typeof insertTrialSignupSchema>;
export type TrialSignup = typeof trialSignups.$inferSelect;

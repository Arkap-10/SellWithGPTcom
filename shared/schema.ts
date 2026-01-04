import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trialSignups = pgTable("trial_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  companyName: text("company_name"),
  phone: text("phone"),
  planName: text("plan_name"),
  magentoVersion: text("magento_version"),
  monthlyOrders: text("monthly_orders"),
  integrationTimeline: text("integration_timeline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrialSignupSchema = createInsertSchema(trialSignups).pick({
  email: true,
  fullName: true,
  companyName: true,
  phone: true,
  planName: true,
  magentoVersion: true,
  monthlyOrders: true,
  integrationTimeline: true,
}).extend({
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        const disposableDomains = [
          'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
          'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'getnada.com'
        ];
        return !disposableDomains.includes(domain);
      },
      { message: "Please use a professional email address" }
    )
    .refine(
      (email) => {
        const [local, domain] = email.split('@');
        return local && local.length > 0 && domain && domain.includes('.');
      },
      { message: "Invalid email format" }
    ),
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  magentoVersion: z.string().optional(),
  monthlyOrders: z.string().optional(),
  integrationTimeline: z.string().optional(),
});

export type InsertTrialSignup = z.infer<typeof insertTrialSignupSchema>;
export type TrialSignup = typeof trialSignups.$inferSelect;

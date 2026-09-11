import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(254),
  password: z.string().min(10).max(128)
    .refine((p) => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p), "Password must include upper, lower and number."),
  dateOfBirth: z.string().refine((s) => !isNaN(Date.parse(s)), "Invalid date"),
  country: z.string().min(2).max(80),
  locale: z.string().default("en"),
  phone: z.string().max(30).optional(),
  displayName: z.string().max(60).optional(),
  heightCm: z.number().positive().max(250).optional(),
  weightKg: z.number().positive().max(400).optional(),
  typicalCycleLength: z.number().int().min(15).max(90).optional(),
  typicalPeriodLength: z.number().int().min(1).max(15).optional(),
  consentPrivacy: z.literal(true, { errorMap: () => ({ message: "Privacy consent required" }) }),
  consentTerms: z.literal(true, { errorMap: () => ({ message: "Terms consent required" }) }),
});

export const loginSchema = z.object({
  email: z.string().email(), password: z.string().min(1),
});

export const cycleSchema = z.object({
  startDate: z.string().refine((s) => !isNaN(Date.parse(s))),
  endDate: z.string().optional(),
});

export const dayLogSchema = z.object({
  date: z.string(),
  flow: z.enum(["spotting", "light", "medium", "heavy"]).optional(),
  symptoms: z.array(z.string()).default([]),
  mood: z.string().optional(),
  painScore: z.number().int().min(0).max(10).optional(),
  painLocations: z.array(z.string()).default([]),
  medication: z.string().optional(),
  notes: z.string().max(2000).optional(),
  temperatureC: z.number().min(30).max(45).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  stressLevel: z.number().int().min(0).max(10).optional(),
  waterMl: z.number().int().min(0).max(6000).optional(),
});

export const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(4000),
  shameFree: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

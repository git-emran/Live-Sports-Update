import { z } from "zod";

export const listCommentaryQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .positive("Limit must be a positive number")
    .max(100, "Limit cannot exceed 100")
    .optional()
});

export const createCommentarySchema = z.object({
  minute: z
    .number({ required_error: "Minute is required" })
    .int("Minute must be an integer")
    .nonnegative("Minute must be non-negative"),
  
  sequence: z
    .number()
    .int()
    .nonnegative()
    .optional(),
  
  period: z
    .string({ required_error: "Period is required" })
    .trim()
    .min(1, "Period cannot be empty"),
  
  eventType: z
    .string()
    .trim()
    .optional(),
  
  actor: z
    .string()
    .trim()
    .optional(),
  
  team: z
    .string()
    .trim()
    .optional(),
  
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message is required"),
  
  metadata: z
    .record(z.unknown())
    .optional(),
  
  tags: z
    .array(z.string().trim())
    .optional()
});

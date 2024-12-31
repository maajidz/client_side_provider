"use client";

import { z } from "zod";

export const questionnaireSchema = z.object({
  currentWeight: z.number().min(1, { message: "current weight is required" }),
  currentHeight: z.number().min(1, { message: "current height is required" }),
  normalBodyWeight: z
    .number()
    .min(1, { message: "normal body weight is required" }),
  weightChange: z.enum(["Yes", "No"]),
  weightGained: z.string(),
  currentDiet: z.string().min(1, { message: "current diet info is required" }),
});
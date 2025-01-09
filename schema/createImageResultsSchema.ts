// createLabResultsSchema.ts
"use client";

import { z } from "zod";

export const createImageResultsSchema = z.object({
  patient: z.string().min(1, "Patient name is required"),
  testIds: z.array(z.string()).min(1, "At least one test is required"),
  testResults: z
    .array(
      z.object({
        document: z.array(z.string()),
        interpretation: z.string().optional()
      })
    )
    .min(1, "At least one test group is required")
});


export const filterLabResultsSchema = z.object({
  reviewer: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
});
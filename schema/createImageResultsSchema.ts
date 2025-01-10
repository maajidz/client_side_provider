// createLabResultsSchema.ts
"use client";

import { z } from "zod";

export const createImageResultsSchema = z.object({
  patient: z.string().min(1, "Patient name is required"),
  testIds: z.array(z.string()).min(1, "At least one test is required"),
  testResults: z.array(
    z.object({
      interpretation: z.string(),
    }),
  ),
});

export const filterImageResultsSchema = z.object({
  status: z.string().optional(),
  name: z.string().optional(),
});

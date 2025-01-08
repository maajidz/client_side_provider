// createLabResultsSchema.ts
"use client";

import { z } from "zod";

export const createImageResultsSchema = z.object({
  patient: z.string().min(1, "Patient name is required"),
  reviewer: z.string().min(1, "Reviewer  is required"),
  dateTime: z.string().min(1, "Date and time are required"),
  imageId: z.string().min(1, "Lab is required"),
  testIds: z.array(z.string()).min(1, "At least one test is required"),
  testResults: z
    .array(
      z.object({
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
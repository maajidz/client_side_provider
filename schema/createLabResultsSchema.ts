// createLabResultsSchema.ts
"use client";

import { z } from "zod";

export const createLabResultsSchema = z.object({
  patient: z.string().min(1, "Patient name is required"),
  reviewer: z.string().min(1, "Reviewer  is required"),
  dateTime: z.string().min(1, "Date and time are required"),
  labId: z.string().min(1, "Lab is required"),
  testIds: z.array(z.string()).min(1, "At least one test is required"),
  testResults: z
    .array(
      z.object({
        name: z.string().min(1, "Parameter name is required"),
        result: z.string().min(1, "Result is required"),
        unit: z.string().optional(),
        referenceMin: z.number().optional(),
        referenceMax: z.number().optional(),
        interpretation: z.string().optional(),
        comment: z.string().optional(),
        groupComment: z.string().optional(),
      })
    )
    .min(1, "At least one test group is required"),
  tags: z.string().optional(),
});

export const filterLabResultsSchema = z.object({
  reviewer: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
});
"use client";

import { z } from "zod";

export const recallFormSchema = z.object({
  type: z.string().min(1, { message: "Type is required." }),
  notes: z.string().min(1, { message: "Notes are required." }),
  dueDate: z.object({
    period: z.string().min(1,{
      message: "Select a valid period.",
    }),
    value: z.number().min(1, { message: "Enter a valid duration." }),
    unit: z.string().min(1, {
      message: "Select a valid unit.",
    }),
  }),
  provider: z.string().min(1, { message: "Provider is required." }),
  sendAutoReminders: z.boolean(),
});

export const filterRecallsSchema = z.object({
  type: z.string().optional(),
  status: z.string().optional()
});
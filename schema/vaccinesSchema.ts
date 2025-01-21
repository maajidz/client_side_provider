"use client";

import { z } from "zod";

export const vaccinesFormSchema = z.object({
  vaccine_name: z.string().min(1, { message: "Vaccine is required" }),
  in_series: z.string().optional(),
  date: z.string().min(1, { message: "Start Date is required" }),
  source: z.string().optional(),
  notes: z.string().optional(),
});

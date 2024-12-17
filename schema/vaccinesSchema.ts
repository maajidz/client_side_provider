"use client";

import { z } from "zod";

export const vaccinesFormSchema = z.object({
  vaccine: z.string().min(1, { message: "Vaccine is required" }),
  series: z.string().optional(),
  fromDate: z.string().min(1, { message: "Start Date is required" }),
  source: z.string().optional(),
  notes: z.string().optional(),
});

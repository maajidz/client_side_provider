"use client";

import { z } from "zod";

export const supplementsFormSchema = z.object({
  supplement: z.string().min(1, { message: "Supplements is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  fromDate: z.string().min(1, { message: "Start Date is required" }),
  toDate: z.string().min(1, { message: "End Date is required" }),
  status: z.enum(["Active", "Inactive"], {
    message: "Please select status",
  }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  intake_type: z.string().min(1, { message: "Intake type is required" }),
  comments: z.string().min(1, { message: "Comments is required" }),
});

"use client";

import { z } from "zod";

export const addMedicationFormSchema = z.object({
  directions: z.string().min(1, { message: "Medication directions is required" }),
  fromDate: z.string().min(1, { message: "Start Date is required" }),
  toDate: z.string().min(1, { message: "End Date is required" }),
  status: z.enum(["Active", "Inactive"], {
    message: "Please select status",
  }),
});

"use client";

import { z } from "zod";

export const prescriptionSchema = z.object({
  primary_diagnosis: z.string().min(1, "Diagnosis is required."),
  secondary_diagnosis: z.string().min(1, "Diagnosis is required."),
  dosage_quantity: z.number().min(1, "Dosage quantity must be greater than 0."),
  dosage_unit: z.string(),
  route: z.string(),
  frequency: z.string(),
  when: z.string(),
  duration_quantity: z.string(),
  duration_unit: z.string(),
  directions: z.string().min(1, "Directions are required."),
  dispense_quantity: z
    .number()
    .min(1, "Dispense quantity must be greater than 0."),
  dispense_unit: z.string(),
  days_of_supply: z.number().optional(),
  additional_refills: z
    .number()
    .min(0)
    .max(99, "Refills must be between 0-99."),
  earliest_fill_date: z.string().optional(),
  internal_comments: z.string().optional(),
  prior_auth: z.string().min(1, "Prior Auth is required."),
  prior_auth_decision: z.string().min(1, "Prior Auth Decision is required."),
  Note_to_Pharmacy: z.string().min(1, "Note to Pharmacy is required."),
});

export const editPrescriptionSchema = z.object({
  dispense_as_written: z.boolean().default(false),
  fromDate: z.string(),
  toDate: z.string(),
  internal_comments: z.string().optional(),
  status: z.enum(["pending", "completed", "active"]),
});

export const filterPrescriptionSchema = z.object({
  patient: z.string().optional(),
  provider: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

import { z } from "zod";

export const addInjectionSchema = z.object({
  userDetailsId: z.string().optional(),
  providerId: z.string().min(1, "Select a provider"),
  injection_name: z.string().min(1, { message: "Injection name is required" }),
  dosage: z.object({
    dosage_unit: z.string().min(1, { message: "Dosage unit is required" }),
    dosage_quantity: z
      .number()
      .min(1, { message: "Dosage quantity is required" }),
  }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  period: z.object({
    period_number: z.number().min(1, { message: "Period number is required" }),
    period_unit: z.string().min(1, { message: "Period unit is required" }),
  }),
  parental_route: z.string().min(1, { message: "Parental route is required" }),
  note_to_nurse: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(["Pending", "Completed"]).default("Pending"),
});

export const injectionsSearchParams = z.object({
  providerId: z.string().optional(),
  userDetailsId: z.string().optional(),
  status: z.string().optional(),
});

export const addVaccineSchema = addInjectionSchema
  .pick({
    userDetailsId: true,
    providerId: true,
  })
  .extend({
    vaccine_name: z.string().min(1, "Vaccine name is required"),
  });

export const vaccineSearchParams = injectionsSearchParams;

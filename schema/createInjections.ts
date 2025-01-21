import { z } from "zod";

export const createInjectionSchema = z.object({
  injection_name: z.string().min(1, { message: "Injection name is required" }),
  dosage_unit: z.string().min(1, { message: "Dosage unit is required" }),
  dosage_quantity: z
    .number()
    .min(1, { message: "Dosage quantity is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  period_number: z.number().min(1, { message: "Period number is required" }),
  period_unit: z.string().min(1, { message: "Period unit is required" }),
  parental_route: z
    .string()
    .min(1, { message: "Parental route is required" }),
  site: z.string().min(1, { message: "Site is required" }),
  lot_number: z.number().min(1, { message: "Lot number is required" }),
  expiration_date: z.string().min(1, { message: "Expiration date is required" }),
  administered_date: z
    .string()
    .min(1, { message: "Administered date is required" }),
  administered_time: z
    .string()
    .min(1, { message: "Administered time is required" }),
  note_to_nurse: z.string(),
  comments: z.string(),
});

import { z } from "zod";

export const addVitalsSchema = z.object({
  dateTime: z.string({ required_error: "Must be a valid datetime string" }),
  weightLbs: z.number({required_error: "Weight in lbs must be a positive number"}),
  weightOzs: z
    .number()
    .min(0, { message: "Weight in ozs must be a positive number" })
    .max(15, { message: "Weight in ozs must be less than 16" }),
  heightFeets: z
    .number()
    .min(0, { message: "Height in feet must be a positive number" }),
  heightInches: z
    .number()
    .min(0, { message: "Height in inches must be a positive number" })
    .max(11, { message: "Height in inches must be less than 12" }),
  BMI: z.number().min(0, { message: "BMI must be a positive number" }),
  startingWeight: z
    .number()
    .min(0, { message: "Starting weight must be a positive number" }),
  goalWeight: z
    .number()
    .min(0, { message: "Goal weight must be a positive number" }),
});

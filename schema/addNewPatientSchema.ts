import { z } from "zod";

export const addNewPatientSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters."),
  lastName: z.string().min(2, "Last Name must be at least 2 characters."),
  height: z.union([
    z.object({
      unit: z.literal("feet"),
      feet: z.string().min(1, "Height in feet is required"),
      inches: z.string().min(0, "Height in inches is required"),
    }),
    z.object({
      unit: z.literal("cm"),
      value: z.string().min(2, "Height in cm is required"),
    }),
  ]),
  weight: z.object({
    value: z.string().min(1, "Weight is required."),
    units: z.enum(["kg", "Pounds"]),
  }),
  phoneNumber: z.string().refine(
    (num) => {
      return num.length >= 10 && /^\d{10,}$/.test(num);
    },
    {
      message: "Invalid phone number format. At least 10 digits are required.",
    }
  ),
  dob: z.string({ required_error: "A date of birth is required." }),
  state: z.string().min(1, "Select a state"),
  gender: z.string().nonempty(),
  email: z.string().min(1, "Email Requires")
});

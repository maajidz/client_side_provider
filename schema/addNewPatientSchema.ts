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
  email: z.string().min(1, "Email Requires"),
  // category: z.string().optional(),
  // blood_group: z.string().optional(),
  // language: z.string().optional(),
  // race: z.string().optional(),
  // ethnicity: z.string().optional(),
  // smoking_status: z.string().optional(),
  // martial_status: z.string().optional(),
  // employment_status: z.string().optional(),
  // sexual_orientation: z.string().optional(),
  // emergency_contact_name: z.string().optional(),
  // emergency_contact_number: z.string().optional(),
  // preferred_communication: z.string().optional(),
  // source: z.string().optional(),
  // specific_source: z.string().optional()
});

export const basicInformationSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters."),
  lastName: z.string().min(2, "Last Name must be at least 2 characters."),
  dob: z.string({ required_error: "A date of birth is required." }),
  gender: z.string().nonempty(),
});

export const patientContactSchema = z.object({
  phoneNumber: z.string().refine(
    (num) => {
      return num.length >= 10 && /^\d{10,}$/.test(num);
    },
    {
      message: "Invalid phone number format. At least 10 digits are required.",
    }
  ),
  email: z.string().min(1, "Email Requires"),
  address: z.string().min(1, { message: "Address is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

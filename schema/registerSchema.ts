import { z } from "zod";

export const formRegisterSchema = z.object({
  firstname: z.string().min(3, "Firstname is required"),
  lastname: z.string().min(3, "Lastname is required"),
  phonenumber: z.string().refine(
    (num) => {
      return num.length >= 10 && /^\d{10,}$/.test(num);
    },
    {
      message: "Invalid phone number format. At least 10 digits are required.",
    }
  ),
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type UserFormRegisterValue = z.infer<typeof formRegisterSchema>;

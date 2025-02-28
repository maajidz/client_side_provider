import { z } from "zod";

export const formRegisterSchema = z
  .object({
    firstname: z.string().min(3, "Firstname is required"),
    lastname: z.string().min(3, "Lastname is required"),
    phonenumber: z.string().refine(
      (num) => {
        return num.length >= 10 && /^\d{10,}$/.test(num);
      },
      {
        message:
          "Invalid phone number format. At least 10 digits are required.",
      }
    ),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message:
          "Password should have 8+ characters, including a letter, number, and special character.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormRegisterValue = z.infer<typeof formRegisterSchema>;

import { z } from "zod";

export const newPasswordSchema = z.object({
  newPassword: z
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
});

export const confirmPasswordSchema = z.object({
  confirmPassword: z.string().min(8, {
    message:
      "Password should have 8+ characters, including a letter, number, and special character.",
  }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: "Enter the old password. (8+ characters long)." }),
    newPassword: newPasswordSchema.shape.newPassword,
    confirmPassword: confirmPasswordSchema.shape.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

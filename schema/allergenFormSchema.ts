import { z } from "zod";

export const allergenFormSchema = z.object({
  allergens: z.array(
    z.object({
      type: z.string().min(1, "Type is required."),
      Allergen: z.string().min(1, "Allergen is required."),
      serverity: z.string().min(1, "Severity is required."),
      observedOn: z.string().min(1, "Date is required."),
      status: z.string().min(1, "Status is required."),
      reactions: z.string().optional(),
    })
  ),
});

export const reactionSchema = z.object({
  name: z.string(),
  additionalText: z.string(),
});

export const updateAllergyFormSchema = z.object({
  type: z.string().min(1, "Type is required."),
  Allergen: z.string().min(1, "Allergen is required."),
  serverity: z.string().min(1, "Severity is required."),
  observedOn: z.string().min(1, "Date is required."),
  status: z.string().min(1, "Status is required."),
  reactions: z.array(reactionSchema).optional(),
});

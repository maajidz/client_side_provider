import { z } from "zod";

export const allergenFormSchema = z.object({
  allergens: z.array(
    z.object({
      type: z.string().min(1, "Type is required."),
      allergen: z.string().min(1, "Allergen is required."),
      severity: z.string().min(1, "Severity is required."),
      observedOn: z.string().min(1, "Date is required."),
      status: z.string().min(1, "Status is required."),
      reactions: z.string().optional(),
    })
  ),
});

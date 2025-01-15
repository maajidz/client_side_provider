import { z } from "zod";

export const searchParamsForDocumentsSchema = z.object({
  patient: z.string().min(1, { message: "Please select a patient" }),
  reviewer: z.string().optional(),
  status: z.enum(["pending", "completed", "all", ""]).optional(),
});

import { z } from "zod";

export const filterLabOrdersSchema = z.object({
  orderedby: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
});

export const createLabOrdersSchema = z.object({
  patient: z.string().optional(),
  orderedBy: z.string().min(1, { message: "Ordered by is required" }),
  date: z.string(),
  labs: z.array(z.string()),
  tests: z.array(z.string()),
  isSigned: z.boolean(),
});

import { z } from "zod";

export const filterLabOrdersSchema = z.object({
  orderedby: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
});

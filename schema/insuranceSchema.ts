import { z } from "zod";

export const insuranceFormSchema = z.object({
  companyName: z.string().min(1, "Required"),
  subscriberNumber: z.string().min(1, "Required"),
  groupNameOrNumber: z.string().min(1, "Required"),
  idNumber: z.string().min(2, "Required."),
  // frontDocumentImage: z.instanceof(File),
  // backDocumentImage: z.instanceof(File),
});

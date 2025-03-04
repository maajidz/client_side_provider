import { z } from "zod";

export const addImageResultFormSchema = z.object({
  testResults: z.array(
    z.object({
      // imageTestId: z.string().min(1, "Image test Id is required."),
      interpretation: z.string().min(1, "Image interpretation is required."),
      document: z.string().min(1, "Image document is required."),
    })
  ),
});

export const createImageOrderSchema = z.object({
  patient: z.string().min(1, { message: "Patient field is required" }),
  orderedBy: z.string().min(1, { message: "Ordered by is required" }),
  orderedDate: z.string().min(1, {message: "Ordered date is required"}),
  imageTypeId: z.string().min(1, { message: "Image type is required" }),
  imageTestIds: z.array(z.string()),
  note_to_patients: z.string().optional(),
  intra_office_notes: z.string().optional(),
});

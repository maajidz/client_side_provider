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
  patient: z.string().optional(),
  providerId: z.string(),
  ordered_date: z.string().optional(),
  imageTypeId: z.string(),
  imageTestIds: z.string(),
  note_to_patients: z.string(),
  intra_office_notes: z.string(),
});

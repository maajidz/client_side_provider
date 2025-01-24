import { z } from "zod";

export const uploadDocumentSchema = z.object({
  file: z
    .array(z.instanceof(File))
    .refine(
      (fileList) => fileList.every((file) => file.size <= 25 * 1024 * 1024),
      { message: "File size must be less than 25MB" }
    )
    .refine(
      (fileList) => fileList.every((file) => file.type === "application/pdf"),
      { message: "Only PDF files are supported" }
    )
    .optional(),
  date: z.string().min(1, { message: "Select a date" }),
  document_type: z.string().min(1, { message: "Select a document type" }),
  file_for_review: z.boolean().default(false),
});

export const searchParamsForDocumentsSchema = z.object({
  patient: z.string().min(1, { message: "Please select a patient" }),
  reviewer: z.string().optional(),
  status: z.enum(["pending", "completed", "all", ""]).optional(),
});

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
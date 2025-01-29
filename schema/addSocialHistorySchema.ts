import { z } from "zod";

export const addSocialHistorySchema = z.object({
  content: z.string().min(10, { message: "Content is required" }),
});

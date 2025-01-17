"use client";

import { z } from "zod";

export const quickNotesSchema = z.object({
    notes: z.string().min(1, { message: "Alert Name is required" })
});

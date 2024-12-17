"use client";

import { z } from "zod";

export const alertSchema = z.object({
    alertName: z.string().min(1, { message: "Alert Name is required" }),
    alertDescription: z.string().min(1, { message: "Alert Description is required" }),
});

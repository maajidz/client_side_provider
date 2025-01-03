"use client";

import { z } from "zod";

export const familyHistorySchema = z.object({
    relationship: z.string(),
    deceased: z.boolean().optional(),
    age: z.number().optional(),
    activeProblems: z.array(z.string()).optional(),
    comments: z.string().optional(),
});

"use client";

import { z } from "zod";

export const familyHistorySchema = z.object({
    relationship: z.string().nonempty("Relationship is required"),
    deceased: z.boolean().optional(),
    age: z.number().optional(),
    activeProblems: z.array(z.string()).optional(),
    comments: z.string().optional(),
});

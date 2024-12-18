"use client";

import { z } from "zod";

export const addPastMedicalHistorySchema = z.object({
    notes: z.string().min(1, { message: "Note is required" }),
    glp_refill_note_practice: z.string().min(1, { message: "GLP Refill Note_Practice - PMH is required" }),
});

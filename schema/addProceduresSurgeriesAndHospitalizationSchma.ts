"use client";

import { z } from "zod";

export const addProceduresSurgeriesAndHospitalizationFormSchema = z.object({
    type: z.string().optional(),
    name: z.string().min(1, { message: "Procedures, Surgeries, and Hospitalization Name is required" }),
    fromDate: z.string().optional(),
    notes: z.string().optional(),
});

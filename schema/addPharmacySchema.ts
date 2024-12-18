"use client";

import { z } from "zod";

export const addPharmacyFormSchema = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    phone: z.string().optional(),
});

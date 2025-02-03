"use client";

import { z } from "zod";

export const addImplantedDevicesSchema = z.object({
    udi: z.string(),
});

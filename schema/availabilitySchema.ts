import { z } from "zod";

export const appointmentDateSchema = z.object({
    appointmentDate:
        z.date().refine((date) => date instanceof Date && !isNaN(date.valueOf()), {
            message: "Invalid date",
        }),
    timeZone: z.array(z.object({
        startTime: z.string(),
        endTime: z.string(),
    }))
})
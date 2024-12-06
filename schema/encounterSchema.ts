import { z } from 'zod';

export const encounterSchema = z.object({
    vist_type: z.string(),
    encounterMode: z.string(),
    chartType: z.string(),
    date: z.string()
});

export type EncounterSchema = z.infer<typeof encounterSchema>;



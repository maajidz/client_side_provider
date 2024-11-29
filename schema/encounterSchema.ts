import { boolean, z } from 'zod';

export const encounterSchema = z.object({
    note: z.string(),
    encounterMode: z.string(),
    chartType: z.string(),
});

export type EncounterSchema = z.infer<typeof encounterSchema>;



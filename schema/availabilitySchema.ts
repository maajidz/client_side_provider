import { z } from 'zod';

export const appointmentDateSchema = z.object({
  appointmentDate: z.date(),
  timeSlot: z.array(
    z.object({
      startTime: z.string().min(1, 'Start time is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
  ),
});

export type FormSchema = z.infer<typeof appointmentDateSchema>;
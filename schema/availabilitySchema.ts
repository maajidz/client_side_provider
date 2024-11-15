import { boolean, z } from 'zod';

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


export const updateApointmentDateSchema = z.object({
  date: z.date(),
  isAvailable: z.boolean(),
  notes: z.string(),
  slots: z.array(
    z.object({
      startTime: z.string().min(1, 'Start time is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
  ),
});

export type UpdateApointmentDateFormSchema = z.infer<typeof updateApointmentDateSchema>;
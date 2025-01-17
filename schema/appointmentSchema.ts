import { z } from "zod";

export const appointmentSchema = z.object({
  category: z.enum(["Appointment", "Waiting List"]),
  patient: z.string({ message:  "Patient name is required"} ),
  provider: z.string({ message: "Provider is required" }),
  status: z.enum(["Scheduled", "Consulted", "No Show", "Confirmed"]),
  visitType: z.string({ message: "Visit type is required" }),
  appointmentMode: z.enum(["In Person", "Phone Call"]),
  appointmentFor: z.enum(["Single Date", "Period"]),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string({ message: "Start time is required" }),
  duration: z.number().positive({ message: "Duration must be greater than 0" }),
  reason: z.string().optional(),
  messageToPatient: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
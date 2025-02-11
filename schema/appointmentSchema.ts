import { z } from "zod";

export const appointmentSchema = z.object({
  additionalText: z.string({ required_error: "Additional text is required" }),
  reason: z.string().optional(),
  dateOfAppointment:z.date({ required_error: "Date is required" }),
  timeOfAppointment: z.string({ message: "Time of appointment is required" }),
  // timeZone: z.string({ required_error: "Time zone is required." }),
  status: z.enum(["Scheduled", "Consulted", "No Show", "Confirmed"], {required_error: "Status is required"}),
  providerId: z.string({ message: "Provider Id is required" }),
  // patient: z.string({ message: "Patient name is required" }),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// "use client";

// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// // import { PatientSearch, Patient } from "@/components/ui/combobox/patient-search";
// import { useState } from "react";
// import { Textarea } from "@/components/ui/textarea";

// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   start: z.string(),
//   end: z.string(),
//   reason: z.string().min(1, "Reason is required"),
//   additionalText: z.string().optional(),
// });

// type EventFormProps = {
//   start: Date;
//   end: Date;
//   onSubmit: (data: {
//     patientId: string;
//     dateOfAppointment: string;
//     timeOfAppointment: string;
//     endtimeOfAppointment: string;
//     reason: string;
//     additionalText?: string;
//   }) => void;
//   onCancel: () => void;
// };

// export function EventForm({ start, end, onSubmit, onCancel }: EventFormProps) {
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   // const [patients, setPatients] = useState<Patient[]>([]);
//   // const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       start: start.toISOString().slice(0, 16),
//       end: end.toISOString().slice(0, 16),
//       reason: "",
//       additionalText: "",
//     },
//   });

//   // const searchPatients = async (query: string) => {
//   //   try {
//   //     setIsLoading(true);
//   //     const response = await fetch(`http://api-pomegranate.ap-south-1.elasticbeanstalk.com/api/patients/search?query=${query}`);
//   //     const data = await response.json();
//   //     setPatients(data.map((patient: any) => ({
//   //       id: patient.id,
//   //       name: patient.name,
//   //       email: patient.email,
//   //       phoneNumber: patient.phoneNumber,
//   //     })));
//   //   } catch (error) {
//   //     console.error('Error searching patients:', error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSubmit = (data: z.infer<typeof formSchema>) => {
//     if (!selectedPatient) {
//       alert('Please select a patient');
//       return;
//     }

//     const startDate = new Date(data.start);
//     const endDate = new Date(data.end);

//     onSubmit({
//       patientId: selectedPatient.id,
//       dateOfAppointment: startDate.toISOString().split('T')[0],
//       timeOfAppointment: startDate.toTimeString().split(' ')[0],
//       endtimeOfAppointment: endDate.toTimeString().split(' ')[0],
//       reason: data.reason,
//       additionalText: data.additionalText,
//     });
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full p-4">
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Patient</label>
//           {/* <PatientSearch
//             // patients={patients}
//             selectedPatient={selectedPatient}
//             onSelect={setSelectedPatient}
//           /> */}
//         </div>

//         <FormField
//           control={form.control}
//           name="start"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Start Time</FormLabel>
//               <FormControl>
//                 <Input type="datetime-local" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="end"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>End Time</FormLabel>
//               <FormControl>
//                 <Input type="datetime-local" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="reason"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Reason</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter reason for appointment" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="additionalText"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Additional Notes</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Enter any additional notes" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <div className="flex justify-end space-x-2">
//           <Button variant="outline" type="button" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit">Create Appointment</Button>
//         </div>
//       </form>
//     </Form>
//   );
// } 
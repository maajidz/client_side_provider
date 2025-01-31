import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { UserAppointmentInterface } from "@/types/userInterface";

const generateAppointmentPDF = ({
  appointmentData,
}: {
  appointmentData: UserAppointmentInterface[];
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header Section
  doc.setFontSize(12);
  doc.text("Pomegranate Health", pageWidth - 10, 10, { align: "right" });
  doc.text("30 N Gould Street", pageWidth - 10, 15, { align: "right" });
  doc.text("Ste R, Sheridan, Wyoming - 82801", pageWidth - 10, 20, {
    align: "right",
  });

  doc.line(10, 25, pageWidth - 10, 25);

  doc.setFontSize(14);
  doc.text("Patient Appointments", 10, 35);

  autoTable(doc, {
    startY: 40,
    head: [["Name", "Email", "Phone Number", "Provider Name", "Date", "Time", "Note"]],
    body: appointmentData.map((appointment) => [
      appointment.patientName,
      appointment.patientEmail,
      appointment.patientPhoneNumber,
      appointment.providerName,
      appointment.dateOfAppointment,
      `${appointment.timeOfAppointment}- ${appointment.endtimeOfAppointment}`,
      appointment.additionalText,
    ]),
    headStyles: {
      fillColor: "#84012A",
      textColor: "#FFFFFF",
    },
  });

  doc.save("Patient_Appointments.pdf");
};

export default generateAppointmentPDF;

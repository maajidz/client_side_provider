"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserAppointmentInterface } from "@/types/userInterface";
import JoinButton from "./JoinButton";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns"; 

// Define the return type for the badge variant function
// interface BadgeVariant {
//   variant:
//     | "default"
//     | "secondary"
//     | "destructive"
//     | "outline"
//     | "ghost"
//     | "blue"
//     | "indigo"
//     | "purple"
//     | "pink"
//     | "warning"
//     | "success";
//   icon: React.ElementType | null; 
// }

// Function to determine the badge variant and icon based on status
// const getBadgeVariant = (status: string): BadgeVariant => {
//   const normalizedStatus = status.toLowerCase();

//   switch (normalizedStatus) {
//     case "No Show":
//       return { variant: "destructive", icon: XCircle }; // Red for no show
//     case "Consulted":
//       return { variant: "success", icon: CheckCheck }; // Green for consulted
//     case "Pending":
//       return { variant: "warning", icon: Info }; // Yellow for pending
//     case "Confirmed":
//       return { variant: "blue", icon: Check }; // Change "blue" to "secondary" or another valid variant
//     case "Scheduled":
//       return { variant: "blue", icon: Calendar }; // Blue for scheduled
//     default:
//       return { variant: "default", icon: null }; // Default variant
//   }
// };

export const columns = (
  handleRowClick: (userAppointment: UserAppointmentInterface) => void
): ColumnDef<UserAppointmentInterface>[] => [
  {
    accessorKey: "providerName",
    header: "Provider",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.getValue("providerName")}
      </div>
    ),
  },
  {
    accessorKey: "dateOfAppointment",
    header: "Date / Time",
    cell: ({ row }) => {
      const date = row.original.dateOfAppointment;
      const time = row.original.timeOfAppointment;

      // Combine date and time into a single string
      const dateTimeString = `${date}T${time}`;

      // Format the date and time
      const formattedDateTime = format(
        parseISO(dateTimeString),
        "dd MMM, yyyy - hh:mm a"
      );

      return (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original)}
        >
          {formattedDateTime}
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.getValue("reason")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status === "Confirmed"
          ? "success"
          : row.original.status === "No Show"
          ? "destructive" 
          : row.original.status === "Scheduled"
          ? "blue"
          : "warning";

      return <Badge variant={`${statusColor}`}>{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "additionalText",
    header: "",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original)}
      >
        {row.getValue("additionalText")}
      </div>
    ),
  },
  {
    id: "meetingLink",
    header: "Meeting Link",
    cell: ({ row }) => (
      <JoinButton
        appointmentLink={row.original.meetingLink}
        disabled={
          row.original.status === "No Show" ||
          row.original.status === "Consulted"
            ? true
            : false
        }
      />
    ),
    enableSorting: true,
  },
];

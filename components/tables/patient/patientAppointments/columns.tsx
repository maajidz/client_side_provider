"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserAppointmentInterface } from "@/types/userInterface";
import JoinButton from "./JoinButton";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns'; // Import date-fns functions
import { XCircle, Info, Check, Calendar, CheckCheck } from 'lucide-react'; // Import icons

// Define the return type for the badge variant function
interface BadgeVariant {
  variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "blue" | "indigo" | "purple" | "pink" | "warning" | "success";
  icon: React.ElementType | null; // Icon can be a React component or null
}

// Function to determine the badge variant and icon based on status
const getBadgeVariant = (status: string): BadgeVariant => {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case "no show":
      return { variant: "destructive", icon: XCircle }; // Red for no show
    case "consulted":
      return { variant: "blue", icon: CheckCheck }; // Green for consulted
    case "pending":
      return { variant: "warning", icon: Info }; // Yellow for pending
    case "confirmed":
      return { variant: "success", icon: Check }; // Change "blue" to "secondary" or another valid variant
    case "scheduled":
      return { variant: "blue", icon: Calendar }; // Blue for scheduled
    default:
      return { variant: "default", icon: null }; // Default variant
  }
};

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
      const formattedDateTime = format(parseISO(dateTimeString), "dd MMM, yyyy - hh:mm a");

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
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { variant, icon } = getBadgeVariant(row.original.status); // Destructure the returned object

      // Log the entire appointment data for debugging
      console.log("Appointment Data:", row.original);

      return (
        <Badge variant={variant} icon={icon ? icon : undefined}>
          {row.original.status}
        </Badge>
      );
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

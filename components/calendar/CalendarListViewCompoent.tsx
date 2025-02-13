import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileIcon } from "@radix-ui/react-icons";
import { updateAppointmentStatus } from "@/services/providerAppointments";
import { User2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProviderAppointmentsData } from "@/types/appointments";
import { formatDate } from "date-fns";
import GhostButton from "../custom_buttons/buttons/GhostButton";

export const CalendarListViewComponent = ({
  appointment,
}: {
  appointment: ProviderAppointmentsData;
}) => {
  // 8d17ab-purple cde1cf-confirmed b0ce0c-consu
  const [statusValue, setStatusValue] = useState(status);

  const getTriggerColor = () => {
    switch (statusValue) {
      case "Confirmed":
        return "bg-green-200 text-green-700 focus:ring-lime-700";
      case "Consulted":
        return "bg-lime-200 text-lime-700 focus:ring-lime-700";
      case "No Show":
        return "bg-purple-200 text-purple-700 focus:ring-purple-700";
      case "Scheduled":
        return "bg-purple-200 text-purple-700 focus:ring-purple-700";
      default:
        return "bg-gray-200 text-gray-700 focus:ring-gray-700";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatusValue(newStatus);
    const requestData = {
      status: newStatus,
    };
    try {
      await updateAppointmentStatus({
        appointmentID: appointment.id,
        requestData,
      });
    } catch (error) {
      console.log("Failed to update status:", error);
    }
  };
  return (
    <div className="flex flex-col gap-2 border-2 rounded-lg px-4 py-3">
      <div className="flex justify-between font-semibold">
        <div className="text-lg font-semibold capitalize">
          {appointment.patientName}{" "}
          <span className="text-[#666]">
            [{appointment.id.slice(0, 5).toUpperCase()}]
          </span>
        </div>
        <div className="flex gap-3">
          <div className="text-sm text-[#444] flex items-center gap-2">
            <span>{"providerName"}</span>
            <span className="text-[#555] text-base">|</span>
            <span>
              {appointment.timeOfAppointment} - {appointment.timeOfAppointment}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <Avatar className="w-14 h-14">
            <AvatarImage src="https://github.com/shadcn" alt="Patient Avatar" />
            <AvatarFallback>
              <User2Icon color="#999" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2 text-gray-500">
              <span>Reason</span>
              <span>DOB</span>
              <span>Status</span>
            </div>
            <div className="flex flex-col gap-2 font-semibold">
              <span>{appointment.reason}</span>
              <div className="flex flex-row items-center gap-4">
                <span>
                  {formatDate(appointment.userDetails.dob, "MM/dd/yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <MobileIcon />
                  <span>{appointment.patientPhoneNumber}</span>
                </span>
              </div>
              <Select
                onValueChange={handleStatusChange}
                value={appointment.status}
              >
                <SelectTrigger
                  className={`gap-2 w-fit h-[28px] font-semibold border-none ${getTriggerColor()}`}
                >
                  <SelectValue placeholder={statusValue} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Consulted">Consulted</SelectItem>
                    <SelectItem value="No Show">No Show</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-start items-start">
          <div className="flex flex-col gap-2 text-gray-500">
            <div className="flex gap-4 justify-start items-start">
              <div className="text-gray-500">Meeting Link</div>
              <GhostButton>{appointment.meetingLink}</GhostButton>
            </div>
            <div className="flex gap-4 justify-start items-start">
              <div className="text-gray-500">Visit On</div>
              <div className="font-semibold">
                {appointment.dateOfAppointment}
              </div>
            </div>
            <div className="flex gap-4 justify-start items-start">
              <div className="text-gray-500">Encounter</div>
              {appointment.encounter?.id && (
                <Link
                  href={`/encounter/${appointment.encounter?.id}`}
                  className="font-medium text-blue-600"
                >
                  Start
                </Link>
              )}
            </div>
          </div>
          {/* <LabelComponent label="Vist Type" value={vistType} />
          <LabelComponent label="Vist On" value={lastVist} />
          <div className="flex gap-3 items-center">
            <span className="font-medium text-[#4b5563]">Encounter</span>
            <span> Start</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

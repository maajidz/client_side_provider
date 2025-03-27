import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";
import { ProviderAppointmentsData } from "@/types/appointments";
import { formatDate } from "date-fns";
import { CreateEncounterInterface } from "@/types/chartsInterface";
import { createEncounterRequest } from "@/services/chartsServices";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "../LoadingButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Icon } from "../ui/icon";
import { Button } from "../ui/button";
import { renderAppointmentTime } from "@/utils/utils";
import { getStatusBadgeStyles, getStatusIcon } from "@/utils/appointmentUtils";
import { Badge } from "../ui/badge";
import { updateAppointment } from "@/services/providerAppointments";

export const CalendarListViewComponent = ({
  appointment,
  onFetch,
}: {
  appointment: ProviderAppointmentsData;
  onFetch: () => Promise<void>;
}) => {
  const [statusValue, setStatusValue] = useState(appointment.status);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatusValue(newStatus);
    const requestData = {
      status: newStatus,
    };
    try {
      await updateAppointment({
        appointmentID: appointment.id,
        requestData,
      });
    } catch (error) {
      console.log("Failed to update status:", error);
    } finally {
      await onFetch();
    }
  };

  const handleEncounterStart = async () => {
    const requestData: CreateEncounterInterface = {
      visit_type: appointment.reason,
      mode: "Online",
      isVerified: false,
      userDetailsId: appointment.userDetails.id,
      providerId: appointment.providerId,
      appointmentId: appointment.id,
      date: appointment.dateOfAppointment,
    };
    try {
      setLoading(true);
      const response = await createEncounterRequest({
        requestData: requestData,
      });
      if (response) {
        router.push(`/dashboard/encounter/${response.id}`);
        showToast({
          toast,
          type: "success",
          message: "Successfully created an encounter.",
        });
      }
    } catch (error) {
      showToast({
        toast,
        type: "error",
        message: `Failed to create an encounter. ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex border-2 rounded-lg px-4 py-3 min-h-10 justify-center items-center">
          <LoadingButton />
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row justify-between w-full">
            <CardTitle className="gap-2 items-center">
              <Avatar className="w-11 h-11">
                <AvatarImage
                  src="https://github.com/shadcn"
                  alt="Patient Avatar"
                />
                <AvatarFallback>
                  <div className="flex bg-pink-50 text-[#63293b] text-lg font-medium rounded-full h-14 w-14 justify-center items-center">
                    <span className="uppercase">
                      {appointment.patientName?.split(" ")[0].charAt(0)}
                      {appointment.patientName?.split(" ")[1].charAt(0)}
                    </span>
                  </div>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 justify-center">
                <div className="text-md font-semibold flex gap-2 items-center">
                  {appointment.patientName}
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <span className="text-gray-600 text-xs font-medium">
                    {renderAppointmentTime(
                      appointment.timeOfAppointment || "",
                      appointment.endtimeOfAppointment || ""
                    )}
                  </span>
                  <Select
                    onValueChange={handleStatusChange}
                    value={appointment.status}
                  >
                    <SelectTrigger
                      className={`${getStatusBadgeStyles(statusValue)}`}
                    >
                      <SelectValue placeholder={statusValue}>
                        <span className="flex items-center gap-1 justify-center text-xs">
                          {getStatusIcon(statusValue)}
                          {statusValue}
                        </span>
                      </SelectValue>
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
            </CardTitle>
            <CardDescription className="text-gray-600 justify-between flex-none flex-col items-end">
              {appointment.providerId}
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-gray-100 pt-4 w-full text-sm text-gray-900 items-center">
            <div className="flex flex-row gap-2 justify-between w-full">
              <div className="flex flex-col gap-4 text-xs font-medium">
                <span className="text-gray-600 line-clamp-1">
                  {appointment.reason}
                </span>
                <div className="flex flex-row items-start gap-2">
                  <Badge
                    className="flex items-center gap-1"
                    popoverLabel="Date of Birth"
                  >
                    <Icon
                      name="calendar_month"
                      size={16}
                      className="text-gray-500"
                    />
                    {formatDate(appointment.userDetails.dob, "MM/dd/yyyy")}
                  </Badge>
                  <Badge
                    className="flex items-center gap-1"
                    popoverLabel="Phone Number"
                  >
                    <Icon name="phone" size={16} className="text-gray-500" />
                    <span>{appointment.patientPhoneNumber}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {appointment.encounter?.id ? (
                <Link
                  href={`/dashboard/encounter/${appointment.encounter?.id}`}
                  className="font-medium text-blue-600"
                >
                  Start Encounter
                </Link>
              ) : (
                <Button
                  variant="link"
                  className="rounded-full text-blue-600 hover:text-blue-800"
                  onClick={handleEncounterStart}
                >
                  <Icon name="open_in_new" size={16} />
                  Start Encounter
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-full text-rose-900"
                onClick={() => window.open(appointment.meetingLink, "_blank")}
              >
                Join Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

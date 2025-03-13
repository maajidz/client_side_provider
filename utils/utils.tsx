import { LucideIcon } from "lucide-react";
import { format } from "date-fns";

export const formatDate = (date: Date) => {
  let day = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
  return day;
};

export const showToast = ({
  toast,
  type,
  message,
  icon,
  variant = "default",
}: {
  toast: (options: any) => void;
  type: "success" | "error";
  message: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "error" | "info" | "destructive";
}) => {
  toast({
    description: (
      <div className="flex gap-4 items-center">
        <div>{message}</div>
      </div>
    ),
    variant,
    icon,
  });
};

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();

  const yearsDifference = today.getFullYear() - birthDate.getFullYear();
  const isBeforeBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  return isBeforeBirthdayThisYear ? yearsDifference - 1 : yearsDifference;
};

export const renderAppointmentTime = (
  timeOfAppointment: string,
  endtimeOfAppointment?: string
) => {
  const startTime = new Date(`1970-01-01T${timeOfAppointment}Z`);
  const endTime = endtimeOfAppointment
    ? new Date(`1970-01-01T${endtimeOfAppointment}Z`)
    : startTime; // Use startTime if endtimeOfAppointment is not provided
  
  const durationInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  const durationHours = Math.floor(durationInMinutes / 60);
  const remainingMinutes = durationInMinutes % 60;

  const timeRange = `${format(startTime, 'hh:mm a')} - ${format(endTime, 'hh:mm a')}`;
  return durationHours >= 1 
    ? `${timeRange} (${durationHours} hour${durationHours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''})` 
    : `${timeRange} (${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''})`;
}; 
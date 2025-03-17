import { LucideIcon } from "lucide-react";
import { differenceInDays, format, formatDistance } from "date-fns";

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
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  return isBeforeBirthdayThisYear ? yearsDifference - 1 : yearsDifference;
};


export const renderAppointmentTime = (timeOfAppointment: string, endtimeOfAppointment: string) => {
  const startTime = new Date(`1970-01-01T${timeOfAppointment}Z`);
  const endTime = new Date(`1970-01-01T${endtimeOfAppointment}Z`);
  
  const durationInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  const durationHours = Math.floor(durationInMinutes / 60);
  const remainingMinutes = durationInMinutes % 60;

  const timeRange = `${format(startTime, 'hh:mm a')} - ${format(endTime, 'hh:mm a')}`;
  return durationHours >= 1 
    ? `${timeRange} (${durationHours} hour${durationHours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''})` 
    : `${timeRange} (${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''})`;
};

export const formatVisitType = (type: string): string => {
  switch (type) {
    case "FOLLOW_UP":
      return "Follow Up";
    case "IN_PERSON":
      return "In Person";
    case "TELEMEDICINE":
      return "Telemedicine";
    case "EMERGENCY":
      return "Emergency";
    case "ROUTINE":
      return "Routine";
    case "WELLNESS":
      return "Wellness";
    case "URGENT_CARE":
      return "Urgent Care";
    case "HOME_VISIT":
      return "Home Visit";
    case "INPATIENT":
      return "Inpatient";
    case "OUTPATIENT":
      return "Outpatient";
    case "WEIGHT_LOSS":
      return "Weight Loss";
    case "NUTRITIONAL_COUNSELING":
      return "Nutritional Counseling";
    case "FITNESS_EVALUATION":
      return "Fitness Evaluation";
    case "DIABETES_MANAGEMENT":
      return "Diabetes Management";
    case "LIFESTYLE_MODIFICATION":
      return "Lifestyle Modification";
    case "PREVENTIVE_HEALTH":
      return "Preventive Health";
    default:
      return type.replace(/_/g, " ");
  }
};

export const formatDateDifference = (fromDate: string, toDate: string): string => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  
  const daysDifference = differenceInDays(end, start);

  if (daysDifference < 0) {
    return "Invalid date range";
  } else if (daysDifference === 0) {
    return "Today";
  } else if (daysDifference === 1) {
    return "1 day";
  } else if (daysDifference < 7) {
    return `${daysDifference} days`;
  } else if (daysDifference < 30) {
    const weeks = Math.floor(daysDifference / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  } else {
    return formatDistance(start, end, { addSuffix: true });
  }
}; 
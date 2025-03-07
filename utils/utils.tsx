import { LucideIcon } from "lucide-react";

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

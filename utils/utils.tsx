import { Check, X } from "lucide-react";

export const formatDate = (date: Date) => {
  let day = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
  return day;
};

export const showToast = ({
  toast,
  type,
  message,
}: {
  toast: (options: any) => void;
  type: string;
  message: string;
}) => {
  toast({
    description: (
      <div className="flex gap-4 items-center">
        <div
          className={`flex ${
            type === "success" ? "bg-[#18A900]" : "bg-red-600"
          } h-9 w-9 rounded-md items-center justify-center`}
        >
          {type === "success" ? (
            <Check color="#FFFFFF" />
          ) : (
            <X color="#FFFFFF" />
          )}
        </div>
        <div>{message}</div>
      </div>
    ),
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

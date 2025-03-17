import { Icon } from "@/components/ui/icon";

export const getStatusBadgeStyles = (status: string) => {
  const baseStyles = "shadow-none rounded-full gap-2 w-fit border-0 h-fit px-2 py-1 font-medium transition-colors duration-200 font-semibold items-center justify-center focus:ring-0 active:ring-0";

  switch (status) {
    case "Confirmed":
      return `${baseStyles} bg-green-50 text-green-700`; 
    case "Consulted":
      return `${baseStyles} bg-blue-50 text-blue-800 hover:text-blue-900 hover:bg-blue-800 hover:ring-1 hover:ring-blue-300`; 
    case "No Show":
      return `${baseStyles} bg-red-50 text-red-800 hover:text-red-900 hover:bg-red-800 hover:ring-1 hover:ring-red-300`; 
    case "Scheduled":
      return `${baseStyles} bg-purple-50 text-purple-800 hover:text-purple-900 hover:bg-purple-800 hover:ring-1 hover:ring-purple-300`; 
    default:
      return `${baseStyles} bg-gray-50 text-gray-800 hover:text-gray-900 hover:bg-gray-800 hover:ring-1 hover:ring-gray-300`;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Confirmed":
      return Icon({ name: "check", size: 16, className: "text-green-700" });
    case "Consulted":
      return Icon({ name: "info", size: 14, className: "text-blue-800" });
    case "No Show":
      return Icon({ name: "cancel", size: 14, className: "text-red-800" });
    case "Scheduled":
      return Icon({ name: "access_time", size: 14, className: "text-purple-800" });
    default:
      return null;
  }
};

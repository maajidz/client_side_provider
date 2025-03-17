import { LucideIcon } from "lucide-react";

interface LabelValueStackedProps {
  label: string;
  value: string | undefined;
  icon?: LucideIcon;
}

export function LabelValueStacked({ label, value, icon: Icon }: LabelValueStackedProps) {
  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        <span className="font-semibold">{label}</span>
      </div>
      <span className="text-gray-600">{value || "-"}</span>
    </div>
  );
} 
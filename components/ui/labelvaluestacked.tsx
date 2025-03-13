import { Icon } from "@/components/ui/icon";

interface LabelValueStackedProps {
  label: string;
  value: string | undefined;
  iconName?: string;
}

export function LabelValueStacked({ label, value, iconName }: LabelValueStackedProps) {
  return (
    <div className="flex items-start gap-2">
      {iconName && <Icon name={iconName} size={20}  className="pt-0.5" />}
      <div className="flex flex-col gap-1 text-sm font-medium">
        <span className="text-gray-600 text-xs">{label}</span>
        <span className="font-semibold">{value || "-"}</span>
      </div>
    </div>
  );
} 
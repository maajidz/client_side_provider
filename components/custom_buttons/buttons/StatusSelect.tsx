import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusBadgeStyles, getStatusIcon } from "@/utils/appointmentUtils";
import React from "react";

interface StatusOption {
  value: string;
  label: string;
}

const StatusSelect = ({
  selectedValue,
  statusValue,
  handleStatusChange,
  statusOptions,
}: {
  selectedValue: string;
  statusOptions: StatusOption[];
  statusValue: string;
  handleStatusChange: (value: string) => void;
}) => (
  <Select value={selectedValue} onValueChange={handleStatusChange}>
    <SelectTrigger className={getStatusBadgeStyles(statusValue)}>
      <SelectValue placeholder={statusValue}>
        <span className="flex items-center justify-center gap-1 text-xs">
          {getStatusIcon(statusValue)}
          <span>{statusValue}</span>
        </span>
      </SelectValue>
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default StatusSelect;

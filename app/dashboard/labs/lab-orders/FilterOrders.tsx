"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LabOrdersInterface } from "@/types/chartsInterface";

interface FilterOrdersProps {
  orders: LabOrdersInterface[];
  onSetFilteredByOrderedBy: (orderedBy: string) => void;
  onSetFilteredByStatus: (status?: boolean) => void;
}

function FilterOrders({
  orders,
  onSetFilteredByOrderedBy,
  onSetFilteredByStatus,
}: FilterOrdersProps) {
  const orderedBy = Array.from(
    new Set(orders?.map((order) => order.orderedBy))
  );

  return (
    <div className="flex gap-4 flex-wrap">
      {/* Ordered By Filter */}
      <Select onValueChange={onSetFilteredByOrderedBy}>
        <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
          <SelectValue placeholder="Ordered By" />
        </SelectTrigger>
        <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
          <SelectItem value="all">All</SelectItem>
          {orderedBy.map((orderedBy) => (
            <SelectItem key={orderedBy} value={orderedBy}>
              {orderedBy}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        onValueChange={(value: string) => {
          return value === "accepted"
            ? onSetFilteredByStatus(true)
            : value === "pending"
            ? onSetFilteredByStatus(false)
            : onSetFilteredByStatus();
        }}
      >
        <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
          <SelectValue placeholder="Order Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterOrders;


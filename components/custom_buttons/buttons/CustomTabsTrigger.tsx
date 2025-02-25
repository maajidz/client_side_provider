import { TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const CustomTabsTrigger = ({
  value,
  children,
  onClick,
}: {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <TabsTrigger
      className="w-full text-gray-500 data-[state=active]:text-gray-800 data-[state=active]:bg-gray-100 font-semibold"
      value={value}
      onClick={onClick}
    >
      {children}
    </TabsTrigger>
  );
};

export default CustomTabsTrigger;

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
      className="w-full text-gray-600 font-normal data-[state=active]:text-[#84012A] 
          data-[state=active]:shadow-md data-[state=active]:shadow-[#FFE7E7] 
          data-[state=active]:border-[#FFE7E7] font-medium"
      value={value}
      onClick={onClick}
    >
      {children}
    </TabsTrigger>
  );
};

export default CustomTabsTrigger;

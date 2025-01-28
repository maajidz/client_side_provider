import { TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const CustomTabsTrigger = ({
  value,
  key,
  children,
}: {
  value: string;
  key: string;
  children: React.ReactNode;
}) => {
  return (
    <TabsTrigger
      className="w-full text-[#90A4AE] font-normal data-[state=active]:text-[#84012A] 
          data-[state=active]:shadow-md data-[state=active]:shadow-[#FFE7E7] 
          data-[state=active]:border-[#FFE7E7]"
      value={value}
      key={key}
    >
      {children}
    </TabsTrigger>
  );
};

export default CustomTabsTrigger;

import { Button } from "@/components/ui/button";
import React from "react";

const DefaultButton = ({
  children,
  onClick,
  disabled
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled? : boolean
}) => {
  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className="flex flex-row items-center gap-2 bg-[#84012A] text-sm text-[#FFFF] hover:text-[#84012A] hover:bg-white hover:border hover:border-[#84012A]  py-4 px-4 rounded-md border-0 h-11 font-semibold [&_svg]:size-6"
    >
      {children}
    </Button>
  );
};

export default DefaultButton;

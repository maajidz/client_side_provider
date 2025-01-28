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
      className="bg-[#84012A] font-normal text-base text-[#FFFF] hover:text-[#84012A] hover:bg-white hover:border hover:border-[#84012A]  py-4 px-8 rounded-xl border-0"
    >
      {children}
    </Button>
  );
};

export default DefaultButton;

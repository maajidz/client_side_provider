import React from "react";
import { Button } from "@/components/ui/button";

const SubmitButton = ({ label }: { label: string }) => {
  return (
    <Button
      type="submit"
      variant="outline"
      className="bg-[#84012A] font-normal text-base text-[#FFFF] hover:text-[#84012A] hover:bg-white hover:border hover:border-[#84012A]  py-4 px-8 rounded-xl border-0"
    >
      {label}
    </Button>
  );
};
export default SubmitButton;

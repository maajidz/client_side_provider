import React from "react";
import { Button } from "@/components/ui/button";

const SubmitButton = ({
  label,
  disabled,
  onClick
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Button
      type="submit"
      variant="outline"
      disabled={disabled}
      className="bg-[#84012A] font-medium text-base text-white hover:text-white hover:bg-rose-950 py-4 px-8 rounded-lg border-0 w-full"
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
export default SubmitButton;

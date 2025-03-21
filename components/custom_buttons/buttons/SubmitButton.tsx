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
      className="self-end"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
export default SubmitButton;

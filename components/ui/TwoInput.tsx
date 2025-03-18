// components/ui/TwoInput.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface TwoInputProps {
  onChange: (values: { first: number; second: number }) => void;
  labelFirst?: string;
  labelSecond?: string;
  placeholderFirst?: string;
  placeholderSecond?: string;
  focusAfter?: number;
  postfixFirst?: string;
  postfixSecond?: string;
  idFirst?: string; // New prop for the first input ID
  idSecond?: string; // New prop for the second input ID
}

const TwoInput: React.FC<TwoInputProps> = ({
  onChange,
  labelFirst,
  labelSecond,
  placeholderFirst,
  placeholderSecond,
  focusAfter = 1,
  postfixFirst,
  postfixSecond,
  idFirst = "first-input", // Default ID for the first input
  idSecond = "second-input", // Default ID for the second input
}) => {
  const [first, setFirst] = useState<number | "">("");
  const [second, setSecond] = useState<number | "">("");

  const handleFirstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      // Allow any number of digits
      setFirst(value ? parseInt(value) : "");
      if (value.length === focusAfter) {
        document.getElementById(idSecond)?.focus(); // Move focus to second input
      }
      onChange({
        first: value ? parseInt(value) : 0,
        second: second ? second : 0,
      });
    }
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setSecond(value ? parseInt(value) : "");
      onChange({
        first: first ? first : 0,
        second: value ? parseInt(value) : 0,
      });
    }
  };

  return (
    <div className="flex gap-2">
      <span className="flex flex-col gap-2 relative">
        {labelFirst && (
          <label className="text-xs font-semibold">{labelFirst}</label>
        )}
        <div className="relative">
          <Input
            id={idFirst}
            type="number"
            value={first}
            onChange={handleFirstChange}
            placeholder={placeholderFirst || ""}
          />
          {postfixFirst && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              {postfixFirst}
            </span>
          )}
        </div>
      </span>
      <span className="flex flex-col gap-2 relative">
        {labelSecond && (
          <label className="text-xs font-semibold">{labelSecond}</label>
        )}
        <div className="relative">
          <Input
            id={idSecond}
            type="number"
            value={second}
            onChange={handleSecondChange}
            placeholder={placeholderSecond || ""}
          />
          {postfixSecond && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              {postfixSecond}
            </span>
          )}
        </div>
      </span>
    </div>
  );
};

export default TwoInput;
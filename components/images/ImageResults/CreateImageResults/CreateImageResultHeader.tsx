import { Button } from "@/components/ui/button";
import { createImageResultsSchema } from "@/schema/createImageResultsSchema";
import { useRouter } from "next/navigation";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const CreateImageResultHeader = ({form}: {form: UseFormReturn<z.infer<typeof createImageResultsSchema>>;}) => {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between">
        Add Image Results
        <div className="flex gap-3">
          <Button
            variant={"outline"}
            className="border border-[#84012A] text-[#84012A]"
            onClick={() => {
              form.reset();
              router.replace("/dashboard/images");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateImageResultHeader;

import { Button } from "@/components/ui/button";
import { createImageResultsSchema } from "@/schema/createImageResultsSchema";
import { useRouter } from "next/navigation";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const CreateImageResultHeader = ({
  form,
  userDetailsId,
}: {
  form: UseFormReturn<z.infer<typeof createImageResultsSchema>>;
  userDetailsId?: string;
}) => {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between">
        <h2>Add Image Results</h2>
        <div className="flex gap-3">
          <Button
            variant={"outline"}
            className="border border-[#84012A] text-[#84012A]"
            onClick={() => {
              form.reset();
              if (userDetailsId) {
                router.replace(`/dashboard/provider/patient/${userDetailsId}/images`);
              } else {
                router.replace(`/dashboard/provider/images`);
              }
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

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLabResultsSchema } from "@/schema/createLabResultsSchema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import { Separator } from "@/components/ui/separator";
import AddImagesDrawer from "@/components/charts/Encounters/SOAP/Images/AddImagesDrawer";
import PastImageOrders from "@/components/charts/Encounters/SOAP/Images/PastImageOrders";
import formStyles from "@/components/formStyles.module.css";

const CreatePatientImageOrders = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const today = new Date().toISOString().split("T")[0];
  const form = useForm<z.infer<typeof createLabResultsSchema>>({
    resolver: zodResolver(createLabResultsSchema),
    defaultValues: {
      patient: userDetailsId,
      reviewer: "",
      dateTime: today,
      labId: "",
      testIds: [],
      testResults: [
        {
          name: "",
          result: "",
          unit: "",
          referenceMin: undefined,
          referenceMax: undefined,
          interpretation: "",
          comment: "",
          groupComment: "",
        },
      ],
      tags: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof createLabResultsSchema>) => {
    console.log(values);
    setLoading(false);
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Image Orders
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace("/dashboard/provider/images");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={formStyles.formBody}>
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Ordered Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        placeholder="Select date"
                        className="w-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <div className="flex h-5 items-center py-5 text-sm">
          <AddImagesDrawer userDetailsId={userDetailsId} />
          <Separator orientation="vertical" />
          <PastImageOrders userDetailsId={userDetailsId} />
          {/* <Separator orientation="vertical" />
                        <MapDx /> */}
        </div>
      </div>
    </>
  );
};

export default CreatePatientImageOrders;

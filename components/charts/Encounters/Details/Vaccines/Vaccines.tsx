import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vaccinesFormSchema } from "@/schema/vaccinesSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LoadingButton from "@/components/LoadingButton";
import VaccinesDialog from "./VaccinesDialog";

const Vaccines = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof vaccinesFormSchema>>({
    resolver: zodResolver(vaccinesFormSchema),
    defaultValues: {
      vaccine: "",
      series: "",
      fromDate: new Date().toISOString().split("T")[0],
      source: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof vaccinesFormSchema>) => {
    console.log("Form Values:", values);
    // const requestData = {
    //     alertName: "",
    //     alertDescription: "",
    // }
    setLoading(true);
    try {
      // await createTransfer({ requestData: requestData })
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="vaccines">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Vaccines</AccordionTrigger>
            <VaccinesDialog form={form} onSubmit={onSubmit} />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Vaccines;

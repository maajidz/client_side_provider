import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplementsFormSchema } from "@/schema/supplementsSchema";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import LoadingButton from "@/components/LoadingButton";
import SupplementsDialog from "./SupplementsDialog";

const Supplements = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof supplementsFormSchema>>({
    resolver: zodResolver(supplementsFormSchema),
    defaultValues: {
      supplement: "",
      manufacturer: "",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      status: "Active",
      dosage: "",
      unit: "",
      frequency: "",
      intake_type: "",
      comments: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof supplementsFormSchema>) => {
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
        <AccordionItem value="supplements">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Supplements</AccordionTrigger>
            <SupplementsDialog form={form} onSubmit={onSubmit} />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Supplements;

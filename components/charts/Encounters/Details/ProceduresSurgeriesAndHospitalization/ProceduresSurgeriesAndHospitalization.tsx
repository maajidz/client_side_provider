import React, { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProceduresSurgeriesAndHospitalizationFormSchema } from "@/schema/addProceduresSurgeriesAndHospitalizationSchma";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProceduresSurgeriesAndHospitalizationDialog from "./ProceduresSurgeriesAndHospitalizationDialog";

const ProceduresSurgeriesAndHospitalization = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<
    z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>
  >({
    resolver: zodResolver(addProceduresSurgeriesAndHospitalizationFormSchema),
    defaultValues: {
      type: "",
      name: "",
      fromDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>
  ) => {
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
        <AccordionItem value="proceduresSurgeriesAndHospitalizationDialog">
          <div className="flex justify-between items-center">
            <AccordionTrigger>
              Procedures, Surgeries, and Hospitalization
            </AccordionTrigger>
            <ProceduresSurgeriesAndHospitalizationDialog
              form={form}
              onSubmit={onSubmit}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProceduresSurgeriesAndHospitalization;

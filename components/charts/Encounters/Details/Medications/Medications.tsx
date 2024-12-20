import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMedicationFormSchema } from "@/schema/addMedicationSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LoadingButton from "@/components/LoadingButton";
import AddMedicationDialog from "./AddMedicationDialog";
import MedicationDetailsDialog from "./MedicationDetailsDialog";

export interface MedicationList {
  productName: string;
  tradeName: string;
  strength: string;
  route: string;
  doseForm: string;
}

const Medications = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddClick = (medication: MedicationList) => {
    setSelectedMedication(medication);
    setIsAddDialogOpen(false);
    setIsDetailsDialogOpen(true);
  };

  const form = useForm<z.infer<typeof addMedicationFormSchema>>({
    resolver: zodResolver(addMedicationFormSchema),
    defaultValues: {
      directions: "",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      status: "Active",
    },
  });

  const onSubmit = async (values: z.infer<typeof addMedicationFormSchema>) => {
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
        <AccordionItem value="medications">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Medications</AccordionTrigger>
            <AddMedicationDialog
              isOpen={isAddDialogOpen}
              onAddClick={handleAddClick}
            />
            <MedicationDetailsDialog
              isOpen={isDetailsDialogOpen}
              form={form}
              medication={selectedMedication}
              onSubmit={onSubmit}
              onClose={() => setIsDetailsDialogOpen(false)}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Medications;

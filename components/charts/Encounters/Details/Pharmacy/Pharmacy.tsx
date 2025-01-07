import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { addPharmacyFormSchema } from "@/schema/addPharmacySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserEncounterData } from "@/types/chartsInterface";
import PharmacyDialog from "./PharmacyDialog";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PharmacyProps {
  patientDetails: UserEncounterData;
}

const Pharmacy = ({ patientDetails }: PharmacyProps) => {
  const form = useForm<z.infer<typeof addPharmacyFormSchema>>({
    resolver: zodResolver(addPharmacyFormSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pharmacy">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Pharmacy</AccordionTrigger>
            <PharmacyDialog form={form} patientDetails={patientDetails} />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Pharmacy;

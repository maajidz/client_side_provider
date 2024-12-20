import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AllergiesDialog from "./AllergiesDialog";

const Allergies = () => {
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="allergies">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Allergies</AccordionTrigger>
            <AllergiesDialog />
          </div>
          <AccordionContent></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Allergies;

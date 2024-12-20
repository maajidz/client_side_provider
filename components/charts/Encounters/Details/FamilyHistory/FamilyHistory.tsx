import LoadingButton from "@/components/LoadingButton";
import { familyHistorySchema } from "@/schema/familyHistorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FamilyHistoryDialog from "./FamilyHistoryDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FamilyHistory = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [customProblem, setCustomProblem] = useState<string>("");
  const [activeProblemOptions, setActiveProblemOptions] = useState([
    { id: "anxiety", label: "Anxiety" },
    { id: "depression", label: "Depression" },
    { id: "diabetes", label: "Diabetes mellitus" },
    { id: "cholesterol", label: "High cholesterol" },
    { id: "hypertension", label: "HTN - Hypertension" },
  ]);

  const form = useForm<z.infer<typeof familyHistorySchema>>({
    resolver: zodResolver(familyHistorySchema),
    defaultValues: {
      relationship: "",
      deceased: false,
      activeProblems: [],
      comments: "",
    },
  });

  const addCustomProblem = () => {
    if (customProblem.trim()) {
      setActiveProblemOptions((prev) => [
        ...prev,
        {
          id: customProblem.toLowerCase().replace(/\s+/g, "_"),
          label: customProblem,
        },
      ]);
      setCustomProblem(""); // Reset input field
    }
  };

  const onSubmit = async (values: z.infer<typeof familyHistorySchema>) => {
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
        <AccordionItem value="familyHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Family History</AccordionTrigger>
            <FamilyHistoryDialog
              activeProblemOptions={activeProblemOptions}
              customProblem={customProblem}
              form={form}
              onAddCustomProblem={addCustomProblem}
              onSetCustomProblem={setCustomProblem}
              onSubmit={onSubmit}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FamilyHistory;

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const questionnaire = [
  "HIPAA Notice and Consent for PHI",
  "MMH PHQ9",
  "Dermatology Initial Assessment",
  "Asynchronous Refill Request",
  "HHH_Nutrition- Meal Plan Journal",
  "Hair Loss Initial Questionnaire",
  "New Patient Medical History Form",
];

function QuestionnairePreviewDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleIsModalOpen(open: boolean) {
    setIsModalOpen(open);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="text-blue-500 underline hover:text-blue-500 hover:bg-transparent"
        >
          Add Now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className=" p-4 rounded-t-lg">
          <DialogTitle>Add Questionnaire</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 my-4">
          {questionnaire.map((question) => (
            <div className="flex items-center space-x-2" key={question}>
              <Checkbox id={question} />
              <label htmlFor={question} className="text-sm">
                {question}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-end">
          <Button variant="ghost" onClick={() => handleIsModalOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-orange-400 text-white hover:bg-orange-600">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default QuestionnairePreviewDialog;


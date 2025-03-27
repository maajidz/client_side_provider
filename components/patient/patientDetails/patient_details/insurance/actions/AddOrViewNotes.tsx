import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateInsurance } from "@/services/insuranceServices";
import {
  InsuranceResponse,
  UpdateInsuranceType,
} from "@/types/insuranceInterface";
import { showToast } from "@/utils/utils";
import { useState } from "react";

interface AddOrViewNotesProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInsurance: InsuranceResponse | undefined;
}

function AddOrViewNotes({
  isOpen,
  onClose,
  selectedInsurance,
}: AddOrViewNotesProps) {
  // Notes State
  const [notesData, setNotesData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const addOrUpdateNotes = async () => {
    if (selectedInsurance) {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", selectedInsurance?.type);
      formData.append("companyName", selectedInsurance?.companyName);
      formData.append(
        "groupNameOrNumber",
        selectedInsurance?.groupNameOrNumber
      );
      formData.append("subscriberNumber", selectedInsurance?.subscriberNumber);
      formData.append("idNumber", selectedInsurance?.idNumber);
      formData.append("status", "inactive");
      formData.append("userDetailsID", selectedInsurance.userDetailsID);
      formData.append("images", selectedInsurance?.frontDocumentImage);
      formData.append("images", selectedInsurance?.backDocumentImage);
      formData.append("notes", notesData);

      try {
        await updateInsurance({
          requestData: formData as unknown as UpdateInsuranceType,
          id: selectedInsurance.id,
        });

        showToast({
          toast,
          type: "success",
          message: "Insurance data updated successfully",
        });
      } catch (err) {
        if (err instanceof Error)
          return showToast({
            toast,
            type: "error",
            message: selectedInsurance
              ? "Insurance data update failed"
              : "Insurance data creation failed",
          });
      } finally {
        setLoading(false);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>Add Notes</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Textarea onChange={(e) => setNotesData(e.target.value)} />
        <div className="flex flex-1 gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={addOrUpdateNotes}>
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">Past Notes</span>
          {selectedInsurance && selectedInsurance.notes ? (
           <div>{selectedInsurance.notes}</div>
          ) : (
            <p className="text-sm">No past notes available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddOrViewNotes;

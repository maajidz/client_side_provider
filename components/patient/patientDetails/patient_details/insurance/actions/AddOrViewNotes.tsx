import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AddOrViewNotesProps {
  isOpen: boolean;
  onSetIsOpenNotesDialog: (status: boolean) => void;
}

function AddOrViewNotes({
  isOpen,
  onSetIsOpenNotesDialog,
}: AddOrViewNotesProps) {
  // Notes State
  const [notesData] = useState([]);

  // Form State
  const form = useForm();

  // Handle Dialog Change
  const handleIsDialogOpen = (status: boolean) => {
    onSetIsOpenNotesDialog(status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Notes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form>
            <Textarea />
          </form>
          <div className="flex flex-1 gap-2 justify-end">
          <Button variant="outline" onClick={() => handleIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Add</Button>
          </div>
        </Form>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">Past Notes</span>
          {notesData.length <= 0 ? (
            <p className="text-sm">No past notes available</p>
          ) : (
            <></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddOrViewNotes;

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const PatientConfirmationScreen = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Patient Created Succesfully!</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        To get Login Details check your email.
      </DialogContent>
    </Dialog>
  );
};

export default PatientConfirmationScreen;

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

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
        <DialogHeader>Patient Created Succesfully!</DialogHeader>
        To get Login Details check your email.
      </DialogContent>
    </Dialog>
  );
};

export default PatientConfirmationScreen;

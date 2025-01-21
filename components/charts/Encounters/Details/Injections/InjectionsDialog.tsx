import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InjectionsDialog = ({
  userDetailsId,
  injectionsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  injectionsData?: null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  useEffect(() => {
    if (injectionsData) {
      console.log(injectionsData);
    }
  }, [injectionsData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Injections</DialogTitle>
        </DialogHeader>
        {userDetailsId}
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InjectionsDialog;

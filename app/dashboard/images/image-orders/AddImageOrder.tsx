import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

function AddImageOrder() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleIsDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleIsDialogOpen}>
        <DialogTrigger className="flex items-center px-4 py-2 text-white bg-[#84012A] rounded-md hover:bg-[#6C011F]">
          <PlusIcon className="w-4 h-4 mr-2" />
          Image Orders
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image Order</DialogTitle>
          </DialogHeader>
          <div className="grid grid-col-3 gap-4 p-2">
            <Button
              variant="outline"
              className="py-2 px-6 border-[#84012A]"
              onClick={() => handleIsDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddImageOrder;


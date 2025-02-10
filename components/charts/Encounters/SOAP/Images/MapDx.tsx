import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

const MapDx = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <GhostButton>Map Dx</GhostButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <SubmitButton label="Save Changes" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapDx;

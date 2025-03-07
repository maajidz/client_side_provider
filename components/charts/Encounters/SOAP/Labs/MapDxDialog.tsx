import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

const MapDxDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <GhostButton>Map Dx </GhostButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <SubmitButton label="Save Changes" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapDxDialog;

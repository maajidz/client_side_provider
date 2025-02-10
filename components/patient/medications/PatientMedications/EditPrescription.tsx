import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { useForm } from "react-hook-form";

interface EditPrescriptionProps {
  isOpen: boolean;
  selectedPrescription: PrescriptionDataInterface | undefined;
  onSetIsOpen: (value: boolean) => void;
}

function EditPrescription({
  isOpen,
  selectedPrescription,
  onSetIsOpen,
}: EditPrescriptionProps) {
  // Form state
  const form = useForm();

  // Handle dialog state
  const handleIsOpen = (status: boolean) => {
    onSetIsOpen(status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Prescription</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 p-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium">Drug:</span>
                <span className="font-semibold">
                  {selectedPrescription?.drug_name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Directions:</span>
                <span className="font-semibold">
                  {selectedPrescription?.directions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Dosage Quantity:</span>
                  {selectedPrescription?.dosages.map((dosage) => (
                    <span key={dosage.id} className="font-semibold">
                      {dosage.dosage_quantity} {dosage.dosage_unit}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">Days of Supply:</span>
                  <span className="font-semibold">
                    {selectedPrescription?.days_of_supply ?? ""}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Refills:</span>
                  <span className="font-semibold">
                    {selectedPrescription?.additional_refills ?? ""}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="dispenseAsWritten"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel className="font-medium">
                        Dispense As Written
                      </FormLabel>
                      <FormControl>
                        <Switch value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Note to Pharmacy:</span>
                <span className="font-semibold">
                  {selectedPrescription?.note_to_Pharmacy ?? ""}
                </span>
              </div>
              {/* <div className="flex items-center justify-between w-full">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="font-medium">From Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="w-fit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="font-medium">
                        To Date
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="w-fit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-medium">Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="internalComments"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-medium">
                      Internal Comments
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleIsOpen(false)}>
                    Cancel
                  </Button>
                  <SubmitButton label="Save" />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPrescription;

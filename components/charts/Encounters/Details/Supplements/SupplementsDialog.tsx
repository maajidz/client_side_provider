import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { supplementsFormSchema } from "@/schema/supplementsSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SupplementsDialogProps {
  form: UseFormReturn<z.infer<typeof supplementsFormSchema>>;
  onSubmit: (values: z.infer<typeof supplementsFormSchema>) => void;
}

function SupplementsDialog({ form, onSubmit }: SupplementsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="supplement"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Supplement</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Alert Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturer1">
                            manufacturer 1
                          </SelectItem>
                          <SelectItem value="manufacturer2">
                            manufacturer 2
                          </SelectItem>
                          <SelectItem value="manufacturer3">
                            manufacturer 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel>From Date:</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>To Date:</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex  gap-2 items-center">
                    <FormLabel className="w-fit">Unit</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit1">unit 1</SelectItem>
                          <SelectItem value="unit2">unit 2</SelectItem>
                          <SelectItem value="unit3">unit 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="flex  gap-2 items-center">
                    <FormLabel className="w-fit">Frequency</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frequency1">
                            frequency 1
                          </SelectItem>
                          <SelectItem value="frequency2">
                            frequency 2
                          </SelectItem>
                          <SelectItem value="frequency3">
                            frequency 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intake_type"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Intake type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Intake type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intake_type1">
                            Intake type 1
                          </SelectItem>
                          <SelectItem value="intake_type2">
                            Intake type 2
                          </SelectItem>
                          <SelectItem value="intake_type3">
                            Intake type 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-[#84012A]">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SupplementsDialog;


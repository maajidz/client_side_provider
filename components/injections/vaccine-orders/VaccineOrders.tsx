import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

function VaccineOrders() {
  const form = useForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-[#84012A] hover:bg-[#6C011F] text-white hover:text-white"
        >
          <PlusIcon />
          Vaccine Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Vaccine Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col justify-center gap-5 p-4">
            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormLabel className="w-full">Patient</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Search by name or record ID"
                      className="border rounded-md p-2 w-full text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="injection"
              render={({ field }) => (
                <FormItem className="flex justify-center items-center">
                  <FormLabel className="w-full">Vaccine</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Search by vaccine name"
                      className="border rounded-md p-2 w-full text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderedBy"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-full">Ordered By</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ordered by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drJennyChau">
                          Dr. Jenny Chau
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex flex-row-reverse gap-2">
              <Button type="submit" className="bg-[#84012A] hover:bg-[#6C011F]">
                Save
              </Button>
              <Button
                variant="outline"
                className="bg-slate-200 hover:bg-slate-100"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default VaccineOrders;


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
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

function InjectionOrders() {
  const form = useForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-[#84012A] hover:bg-[#6C011F] text-white hover:text-white"
        >
          <PlusIcon />
          Injection Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Injection Order</DialogTitle>
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
                  <FormLabel className="w-full">Injection</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter injection to add"
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

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-full">Dosage</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        value={field?.value?.dosage}
                        placeholder="Dosage"
                        className="border rounded-md p-2 w-full text-gray-800"
                      />
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit1">Unit 1</SelectItem>
                          <SelectItem value="unit2">Unit 2</SelectItem>
                          <SelectItem value="unit3">Unit 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-full">Frequency</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frequency1">Frequency 1</SelectItem>
                        <SelectItem value="frequency2">Frequency 2</SelectItem>
                        <SelectItem value="frequency3">Frequency 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-full">Period</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input value={field.value?.days} />
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="period1">Period 1</SelectItem>
                          <SelectItem value="period2">Period 2</SelectItem>
                          <SelectItem value="period3">Period 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  <FormLabel className="w-full">Parental Route</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Parental Route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parentalRoute1">
                          Parental Route 1
                        </SelectItem>
                        <SelectItem value="parentalRoute2">
                          Parental Route 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noteToNurse"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-full">Note to Nurse</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border rounded-md p-2 w-full text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-full">Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border rounded-md p-2 w-full text-gray-800"
                    />
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

export default InjectionOrders;


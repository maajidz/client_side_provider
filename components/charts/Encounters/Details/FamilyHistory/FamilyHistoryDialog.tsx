import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { familyHistorySchema } from "@/schema/familyHistorySchema";

interface FamilyHistoryDialogProps {
  activeProblemOptions: Array<{ id: string; label: string }>;
  customProblem: string;
  form: UseFormReturn<z.infer<typeof familyHistorySchema>>;
  onAddCustomProblem: () => void;
  onSetCustomProblem: (value: string) => void
  onSubmit: (values: z.infer<typeof familyHistorySchema>) => void;
}

function FamilyHistoryDialog({
  activeProblemOptions,
  customProblem,
  form,
  onAddCustomProblem,
  onSetCustomProblem,
  onSubmit,
}: FamilyHistoryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family History</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Relationship</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Natural Father">
                            Natural Father
                          </SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Brother">Brother</SelectItem>
                          <SelectItem value="Sister">Sister</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deceased"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel className="mt-1">Deceased</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter age" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activeProblems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active Problems</FormLabel>
                    <div className="space-y-2">
                      {activeProblemOptions.map((item) => (
                        <FormItem
                          key={item.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>

                    {/* Input for custom problems */}
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Add custom problem"
                        value={customProblem}
                        onChange={(e) => onSetCustomProblem(e.target.value)}
                      />
                      <Button type="button" onClick={onAddCustomProblem}>
                        Add
                      </Button>
                    </div>
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

export default FamilyHistoryDialog;




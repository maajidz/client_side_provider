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
import { createAllergies } from "@/services/chartDetailsServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { allergenFormSchema } from "@/schema/allergenFormSchema";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { PlusCircle, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AllergiesDialogProps {
  patientDetails: UserEncounterData;
}

function AllergiesDialog({ patientDetails }: AllergiesDialogProps) {
  const { toast } = useToast();
  const providerDetails = useSelector((state: RootState) => state.login);
  const form = useForm<z.infer<typeof allergenFormSchema>>({
    resolver: zodResolver(allergenFormSchema),
    defaultValues: {
      allergens: [
        {
          type: "",
          Allergen: "",
          serverity: "",
          observedOn: "",
          status: "",
          reactions: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "allergens",
  });

  const onSubmit = async (data: z.infer<typeof allergenFormSchema>) => {
    console.log("Submitted Data:", data);
    if (patientDetails.userDetails.id) {
      try {
        const requestData = {
          //data.allergens.map((allergen) => ({
          type: data.allergens[0].type,
          serverity: data.allergens[0].serverity,
          observedOn: data.allergens[0].observedOn,
          Allergen: data.allergens[0].Allergen,
          status: data.allergens[0].status,
          reactions: data.allergens[0].reactions
            ? data.allergens[0].reactions.split(",").map((reaction) => ({
                name: reaction.trim(),
                additionalText: "",
              }))
            : [],
          userDetailsId: patientDetails.userDetails.id,
          providerId: providerDetails.providerId,
        };
        // })) : [];

        await createAllergies({ requestData });
        showToast({
          toast,
          type: "success",
          message: "Allergies saved successfully!",
        });
      } catch (error) {
        console.error("Error saving allergies:", error);
        showToast({
          toast,
          type: "error",
          message: "Failed to save allergies. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Allergies</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <table className="w-full border-collapse border-spacing-4">
              <thead>
                <tr>
                  <td className="p-2">Type</td>
                  <td className="p-2">Allergen</td>
                  <td className="p-2">Severity</td>
                  <td className="p-2">Observed On</td>
                  <td className="p-2">Status</td>
                  <td className="p-2">Reactions</td>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {fields.map((field, index) => (
                  <tr key={field.id} className="space-x-4">
                    <td className="p-2">
                      <FormField
                        control={form.control}
                        name={`allergens.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Medication">
                                  Medication
                                </SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    <td className="p-2">
                      <FormField
                        control={form.control}
                        name={`allergens.${index}.Allergen`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter allergen"
                                {...field}
                                className="w-fit"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    <td className="p-2">
                      <FormField
                        control={form.control}
                        name={`allergens.${index}.serverity`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Severe">Severe</SelectItem>
                                <SelectItem value="Moderate">
                                  Moderate
                                </SelectItem>
                                <SelectItem value="Mild">Mild</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    <td className="p-2">
                      <FormField
                        control={form.control}
                        name={`allergens.${index}.observedOn`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="p-2">
                      <FormField
                        control={form.control}
                        name={`allergens.${index}.status`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    <td className="p-2">
                      <FormField
                        control={form.control}
                        name={`allergens.${index}.reactions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Search reactions"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>

                    <td className="p-2">
                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <Trash2Icon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between">
              <Button
                type="button"
                variant={"ghost"}
                onClick={() =>
                  append({
                    type: "",
                    Allergen: "",
                    serverity: "Severe",
                    observedOn: "",
                    status: "Active",
                    reactions: "",
                  })
                }
                className="text-blue-400"
              >
                Add More
              </Button>

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

export default AllergiesDialog;

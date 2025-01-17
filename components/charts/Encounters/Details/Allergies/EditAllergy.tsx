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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateAllergiesData } from "@/services/chartDetailsServices";
import { updateAllergyFormSchema } from "@/schema/allergenFormSchema";
import {
  AllergenResponseInterfae,
  UpdateAllergenInterface,
} from "@/types/allergyInterface";
import { showToast } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

interface EditAllergyProps {
  selectedAllergy?: AllergenResponseInterfae;
  fetchAllergies: () => void;
  onClose: () => void;
  isOpen: boolean;
}

function EditAllergy({
  selectedAllergy,
  fetchAllergies,
  onClose,
  isOpen,
}: EditAllergyProps) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateAllergyFormSchema>>({
    defaultValues: {
      type: selectedAllergy?.type || "",
      Allergen: selectedAllergy?.Allergen || "",
      observedOn: selectedAllergy?.observedOn.split("T")[0],
      serverity: selectedAllergy?.serverity || "",
      status: selectedAllergy?.status || "",
      reactions: Array.isArray(selectedAllergy?.reactions)
        ? selectedAllergy.reactions
        : [],
    },
  });

  useEffect(() => {
    if(selectedAllergy){
      form.reset({
        type: selectedAllergy.type,
        Allergen: selectedAllergy.Allergen,
        observedOn: selectedAllergy.observedOn.split("T")[0],
        serverity: selectedAllergy.serverity,
        status: selectedAllergy.status,
        reactions: Array.isArray(selectedAllergy.reactions)
          ? selectedAllergy.reactions
          : [],
      });
    }
  }, [selectedAllergy, form]);

  const onSubmit = async (formData: UpdateAllergenInterface) => {
    setLoading(true);

    try {
      if (!selectedAllergy) return;
      await updateAllergiesData({
        id: selectedAllergy?.id,
        requestData: formData,
      });

      showToast({
        toast,
        type: "success",
        message: "Allergy editing successful",
      });

      /**
       * * Fetch Again after editing
       */
      fetchAllergies();
    } catch (e) {
      if (e instanceof Error) {
        showToast({ toast, type: "error", message: "Allergy editing failed" });
      }
    } finally {
      setLoading(false);
      onClose();
      form.reset();
    }
  };

  if (loading) return <LoadingButton />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
      
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Allergy</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="space-y-2">
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Allergen</th>
                  <th className="p-4 text-left">Severity</th>
                  <th className="p-4 text-left">Observed On</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Reactions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-4">
                    <FormField
                      control={form.control}
                      name={"type"}
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
                  <td className="p-4">
                    <FormField
                      control={form.control}
                      name={"Allergen"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter allergen"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="p-4">
                    <FormField
                      control={form.control}
                      name={"serverity"}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity">
                                  {field.value}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Severe">Severe</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Mild">Mild</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="p-4">
                    <FormField
                      control={form.control}
                      name={"observedOn"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="p-4">
                    <FormField
                      control={form.control}
                      name={`status`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status">
                                  {field.value}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="p-4">
                    <FormField
                      control={form.control}
                      name={"reactions"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Search reactions"
                              className="w-full"
                              value={
                                field?.value
                                  ? field.value
                                      .map((reaction) => reaction.name)
                                      .join(", ")
                                  : ""
                              }
                              onChange={(event) => {
                                const newValue = event.target.value;
                                field.onChange(
                                  newValue
                                    .split(",")
                                    .map((val) => val.trim())
                                    .map((name) => ({ name }))
                                );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-row-reverse gap-4">
              <Button type="submit" className="bg-[#84012A]">
                Edit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAllergy;

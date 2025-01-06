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
import { useToast } from "@/components/ui/use-toast";
import { addImageResultFormSchema } from "@/schema/imagesFormSchema";
import { createImageResult } from "@/services/chartsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

interface AddImageResultProps {
  patientDetails: UserEncounterData | undefined;
}

function AddImageResult({ patientDetails }: AddImageResultProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof addImageResultFormSchema>>({
    resolver: zodResolver(addImageResultFormSchema),
    defaultValues: {
      testResults: [{ document: "", interpretation: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testResults",
  });

  const handleIsDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleAddImageResult = async (
    formData: z.infer<typeof addImageResultFormSchema>
  ) => {
    setLoading(true);

    const finalTestResults = formData.testResults.map((result) => ({
      ...result,
      imageTestId: "8f048caa-2cca-41f3-90cb-e9ce0c3059a4",
    }));

    await createImageResult({
      requestData: {
        reviewerId: patientDetails?.providerID ?? '',
        userDetailsId: patientDetails?.userDetails.id ?? '',
        testResults: finalTestResults,
      },
    });

    showToast({
      toast,
      type: "success",
      message: "Added image result successfully",
    });
    try {
    } catch (e) {
      if (e instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Failed to add image result",
        });
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleIsDialogOpen}>
        <DialogTrigger className="flex items-center px-4 py-2 text-white bg-[#84012A] rounded-md hover:bg-[#6C011F]">
          <PlusIcon className="w-4 h-4 mr-2" />
          Image Results
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image Result</DialogTitle>
          </DialogHeader>
          <div className="grid grid-col-3 gap-4 p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddImageResult)}>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-6 mb-4">
                    {/* Document Field */}
                    <FormField
                      control={form.control}
                      name={`testResults.${index}.document`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Document
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full p-3 border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Interpretation Field */}
                    <FormField
                      control={form.control}
                      name={`testResults.${index}.interpretation`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Interpretation
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full p-3 border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant={"ghost"}
                  className="text-blue-400 hover:text-blue-500 transition-all duration-200 ease-in-out"
                  onClick={() => append({ document: "", interpretation: "" })}
                >
                  Add More
                </Button>
                <div className="flex flex-row-reverse gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="py-2 px-6 bg-[#84012A] hover:bg-[#6C011F] "
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading}
                    className="py-2 px-6 border-[#84012A]"
                    onClick={() => handleIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddImageResult;



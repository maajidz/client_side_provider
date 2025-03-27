import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { familyHistorySchema } from "@/schema/familyHistorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  createFamilyHistory,
  updateFamilyHistoryData,
} from "@/services/chartDetailsServices";
import {
  ActiveProblem,
  EditFamilyHistoryInterface,
  FamilyHistoryInterface,
} from "@/types/familyHistoryInterface";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";

function FamilyHistoryDialog({
  userDetailsId,
  onClose,
  isOpen,
  familyHistoryData,
}: {
  userDetailsId: string;
  onClose: () => void;
  isOpen: boolean;
  familyHistoryData?: EditFamilyHistoryInterface | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [customProblem, setCustomProblem] = useState<string>("");
  const [activeProblemOptions, setActiveProblemOptions] = useState([
    { id: "anxiety", label: "Anxiety" },
    { id: "depression", label: "Depression" },
    { id: "diabetes", label: "Diabetes mellitus" },
    { id: "cholesterol", label: "High cholesterol" },
    { id: "hypertension", label: "HTN - Hypertension" },
  ]);
  const { toast } = useToast();
  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof familyHistorySchema>>({
    resolver: zodResolver(familyHistorySchema),
    defaultValues: {
      relationship: familyHistoryData?.relationship || "",
      deceased: familyHistoryData?.deceased || false,
      age: familyHistoryData?.age || 0,
      activeProblems: [],
      comments: familyHistoryData?.comments || "",
    },
  });

  useEffect(() => {
    if (familyHistoryData) {
      form.reset({
        relationship: familyHistoryData?.relationship || "",
        deceased: familyHistoryData?.deceased || false,
        activeProblems: familyHistoryData.activeProblems.map(
          (problem) => problem.name
        ),
        age: familyHistoryData?.age || 0,
        comments: familyHistoryData?.comments || "",
      });
    } else {
      form.reset({
        relationship: "",
        deceased: false,
        activeProblems: [],
        age: 0,
        comments: "",
      });
    }
  }, [familyHistoryData, form]);

  const addCustomProblem = () => {
    if (customProblem.trim()) {
      setActiveProblemOptions((prev) => [
        ...prev,
        {
          id: customProblem.toLowerCase().replace(/\s+/g, "_"),
          label: customProblem,
        },
      ]);
      setCustomProblem("");
    }
  };

  const onSubmit = async (values: z.infer<typeof familyHistorySchema>) => {
    console.log("Form Values:", values);
    if (userDetailsId) {
      const transformedActiveProblems: ActiveProblem[] =
        values.activeProblems?.map((problemName) => ({
          name: problemName,
          addtionaltext: "",
        })) || [];

      setLoading(true);
      try {
        if (familyHistoryData) {
          const requestData = {
            relationship: values.relationship,
            deceased: values.deceased ?? false,
            age: Number(values.age),
            comments: values.comments || "",
            activeProblems: transformedActiveProblems,
          };
          await updateFamilyHistoryData({
            requestData: requestData,
            id: familyHistoryData.id,
          });
        } else {
          const requestData: FamilyHistoryInterface = {
            relationship: values.relationship,
            deceased: values.deceased ?? false,
            age: Number(values.age),
            comments: values.comments || "",
            activeProblems: transformedActiveProblems,
            userDetailsId,
            providerId: providerDetails.providerId,
          };
          await createFamilyHistory({ requestData: requestData });
        }
        showToast({
          toast,
          type: "success",
          message: "Family History created successfully!",
        });
        onClose();
      } catch (e) {
        console.log("Error:", e);
      } finally {
        setLoading(false);
        form.reset();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle asChild>
            {familyHistoryData ? "Edit Family History" : "Add Family History"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem className="flex flex-row gap-1 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Deceased</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter age"
                        type="number"
                        {...field}
                        value={
                          field.value !== undefined ? Number(field.value) : ""
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activeProblems"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-semibold">
                      Active Problems
                    </FormLabel>
                    <div className="flex flex-col gap-1">
                      {activeProblemOptions.map((item) => (
                        <FormItem
                          key={item.id}
                          className="flex-row items-center"
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
                          <FormLabel>{item.label}</FormLabel>
                        </FormItem>
                      ))}
                    </div>

                    {/* Input for custom problems */}
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Add custom problem"
                        value={customProblem}
                        onChange={(e) => setCustomProblem(e.target.value)}
                      />
                      <GhostButton onClick={addCustomProblem}>Add</GhostButton>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onClose}>
                    Cancel
                  </Button>
                  <SubmitButton
                    label={loading ? "Saving..." : "Save"}
                    disabled={loading}
                  />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default FamilyHistoryDialog;

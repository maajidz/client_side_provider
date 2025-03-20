import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import RadioButton from "@/components/custom_buttons/radio_button/RadioButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { encounterSchema, EncounterSchema } from "@/schema/encounterSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { createEncounterRequest } from "@/services/chartsServices";
import formStyles from "@/components/formStyles.module.css";
import { getVisitTypes } from "@/services/enumServices";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

const CreatePatientEncounterDialog = ({
  onClose,
  isDialogOpen,
  userDetailsId,
}: {
  onClose: () => void;
  isDialogOpen: boolean;
  userDetailsId: string;
}) => {
  const [visitTypes, setVisitTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const providerDetails = useSelector((state: RootState) => state.login);
  const router = useRouter();

  const methods = useForm<EncounterSchema>({
    resolver: zodResolver(encounterSchema),
    defaultValues: {
      encounterMode: "",
      chartType: "",
      vist_type: "",
      date: "",
    },
  });

  const fetchVisitTypes = useCallback(async () => {
    try {
      setLoading(true);
      const types = await getVisitTypes();

      if (types) {
        setVisitTypes(types);
      }
    } catch (err) {
      console.log("An error occurred", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitTypes();
  }, [fetchVisitTypes]);

  const onSubmit = async (data: EncounterSchema) => {
    console.log(data.date);
    if (userDetailsId) {
      const formattedDate = data.date?.split("T")[0];
      console.log(formattedDate);
      const requestData = {
        visit_type: data.vist_type,
        mode: data.encounterMode,
        isVerified: false,
        userDetailsId: userDetailsId,
        providerId: providerDetails.providerId,
        date: `${formattedDate}`,
      };
      try {
        const encounterResponse = await createEncounterRequest({
          requestData: requestData,
        });
        if (encounterResponse) {
          router.push(`/encounter/${encounterResponse.id}`);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        onClose();
        methods.reset();
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Encounter</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col pb-2">
          <div className={formStyles.formBody}>
            <div className="flex flex-col gap-3">
              <Label>Encounter with:</Label>
              <Input
                placeholder="Provider Name"
                value={`${providerDetails.firstName} ${providerDetails.lastName}`}
              />
            </div>
          </div>
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className={formStyles.formBody}>
                <FormField
                  control={methods.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Date:</FormLabel>
                      <FormControl>
                        <div className="flex flex-row md:gap-2 items-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon />
                                {field.value
                                  ? format(new Date(field.value), "PPP")
                                  : "Select a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date.toISOString());
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="vist_type"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Visit Type:</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value: string) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {visitTypes.map((visit) => (
                              <SelectItem key={visit} value={visit}>
                                {visit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="encounterMode"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Encounter Mode:</FormLabel>
                      <FormControl>
                        <div className="flex gap-3 w-full">
                          <RadioButton
                            label="In Person"
                            name="encounterMode"
                            value="in_person"
                            selectedValue={field.value.toString()}
                            onChange={() => field.onChange("in_person")}
                          />
                          <div className={formStyles.formItem}>
                            <RadioButton
                              label="Phone Call"
                              name="encounterMode"
                              value="phone_call"
                              selectedValue={field.value.toString()}
                              onChange={() => field.onChange("phone_call")}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center mt-3">
                  <SubmitButton label="Create" disabled={loading} />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePatientEncounterDialog;

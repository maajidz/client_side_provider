import React, { useEffect, useState } from "react";
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
import { UserData } from "@/types/userInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { createEncounterRequest } from "@/services/chartsServices";
import { fetchUserDataResponse } from "@/services/userServices";
import LoadingButton from "../LoadingButton";
import SubmitButton from "../custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";

const CreateEncounterDialog = ({
  onClose,
  isDialogOpen,
}: {
  onClose: () => void;
  isDialogOpen: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showEncounterForm, setShowEncounterForm] = useState<boolean>(false);
  const [patient, setPatient] = useState<string>("");
  const [selectedPatient, setSeletedPatient] = useState<UserData | undefined>();
  const [userResponse, setUserResponse] = useState<UserData[] | undefined>([]);
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

  const fetchAndSetResponse = async () => {
    const userData = await fetchUserDataResponse({
      pageNo: 1,
      pageSize: 10,
    });
    if (userData) {
      setUserResponse(userData.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetResponse();
  }, []);

  useEffect(() => {
    const filteredUsers = userResponse?.filter((userData) => {
      const searchTerms = patient.toLowerCase().split(" ");
      return (
        userData?.user &&
        searchTerms.every(
          (term) =>
            userData.user.firstName?.toLowerCase().includes(term) ||
            userData.user.lastName?.toLowerCase().includes(term) ||
            userData.id?.toLowerCase().includes(term)
        )
      );
    });

    setSeletedPatient(filteredUsers?.[0]);
  }, [patient, userResponse]);

  const onSubmit = async (data: EncounterSchema) => {
    console.log(data.date);
    // router.push('/encounter')
    if (selectedPatient) {
      const formattedDate = data.date?.split("T")[0];
      console.log(formattedDate);
      const requestData = {
        visit_type: data.vist_type,
        mode: data.encounterMode,
        isVerified: false,
        userDetailsId: selectedPatient.id,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Encounter</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div className={formStyles.formBody}>
            <div className="flex flex-col gap-3">
              <Label htmlFor="patient-search">Patient:</Label>
              <Input
                id="patient-search"
                type="text"
                placeholder="Search by name or ID..."
                value={patient}
                onChange={(e) => {
                  setPatient(e.target.value);
                  setIsOpen(!isOpen);
                }}
              />
            </div>
            {isOpen && (
              <div>
                <div className="mt-4">
                  {patient && selectedPatient ? (
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold">Matching Patients:</p>
                      <ul className="border rounded p-2">
                        {userResponse
                          ?.filter((userData) => {
                            const searchTerms = patient
                              .toLowerCase()
                              .split(" ");
                            return searchTerms.every(
                              (term) =>
                                userData?.user?.firstName
                                  ?.toLowerCase()
                                  .includes(term) ||
                                userData?.user?.lastName
                                  ?.toLowerCase()
                                  .includes(term) ||
                                userData?.id?.toLowerCase().includes(term)
                            );
                          })
                          .map((userData) => (
                            <li
                              key={userData.id}
                              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => {
                                setSeletedPatient(userData);
                                setPatient(
                                  `${userData.user.firstName} ${userData.user.lastName}`
                                );
                                setIsOpen(!isOpen);
                                setShowEncounterForm(!showEncounterForm);
                              }}
                            >
                              {userData.user.firstName} {userData.user.lastName}{" "}
                              (ID: {userData.id})
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500">No matching patients found.</p>
                  )}
                </div>
                {selectedPatient && (
                  <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h4 className="font-semibold">Selected Patient Details:</h4>
                    <p>
                      <strong>Name:</strong> {selectedPatient.user.firstName}{" "}
                      {selectedPatient.user.lastName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedPatient.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedPatient.user.email}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          {showEncounterForm && (
            <div>
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
                          <FormLabel>Encounter Mode:</FormLabel>
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
                                <SelectItem value="follow_up">
                                  Follow Up
                                </SelectItem>
                                <SelectItem value="vist_type_2">
                                  Vist Type 2
                                </SelectItem>
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
                      <SubmitButton label="Create" />
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEncounterDialog;

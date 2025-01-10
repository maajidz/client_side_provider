import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const CreateEncounterDialog = () => {
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
    const filteredUsers = userResponse?.filter((user) => {
      const searchTerms = patient.toLowerCase().split(" "); // Split input on spaces
      return searchTerms.every(
        (term) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.id.toLowerCase().includes(term)
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
        userDetailsId: "97f41397-3fe3-4f0b-a242-d3370063db33",
        // selectedPatient.id,
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
    <Dialog>
      <DialogTrigger className="bg-[#84012A] hover:bg-[#555] text-white px-4 py-2 rounded-lg">
        Encounter
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Encounter</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center">
            <label htmlFor="patient-search" className="font-semibold">
              Patient:
            </label>
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
                        ?.filter((user) => {
                          const searchTerms = patient.toLowerCase().split(" ");
                          return searchTerms.every(
                            (term) =>
                              user.firstName.toLowerCase().includes(term) ||
                              user.lastName.toLowerCase().includes(term) ||
                              user.id.toLowerCase().includes(term)
                          );
                        })
                        .map((user) => (
                          <li
                            key={user.id}
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                            onClick={() => {
                              setSeletedPatient(user);
                              setPatient(`${user.firstName} ${user.lastName}`);
                              setIsOpen(!isOpen);
                              setShowEncounterForm(!showEncounterForm);
                            }}
                          >
                            {user.firstName} {user.lastName} (ID: {user.id})
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
                    <strong>Name:</strong> {selectedPatient.firstName}{" "}
                    {selectedPatient.lastName}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedPatient.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPatient.email}
                  </p>
                </div>
              )}
            </div>
          )}
          {showEncounterForm && (
            <div>
              <div className="flex flex-row gap-2 items-center">
                <Label className="w-40">Encounter with:</Label>
                <Input
                  placeholder="Provider Name"
                  value={`${providerDetails.firstName} ${providerDetails.lastName}`}
                />
              </div>
              <Form {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <FormField
                    control={methods.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 items-center ">
                        <FormLabel className="w-28">Date:</FormLabel>
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
                                    : format(new Date(), "PPP")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  onSelect={(date) =>
                                    field.onChange(
                                      date ? date.toISOString() : undefined
                                    )
                                  }
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
                      <FormItem className="flex gap-2 items-center ">
                        <FormLabel className="w-28">Encounter Mode:</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2 items-start justify-start ">
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
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="encounterMode"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 items-center ">
                        <FormLabel className="w-28">Encounter Mode:</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2 items-start justify-start ">
                            <RadioButton
                              label="In Person"
                              name="encounterMode"
                              value="in_person"
                              selectedValue={field.value.toString()}
                              onChange={() => field.onChange("in_person")}
                            />
                            <div className="flex items-start justify-start">
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
                    <Button type="submit" className="bg-[#84012A]">
                      Create
                    </Button>
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

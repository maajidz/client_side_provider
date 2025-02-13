import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { referralOutFormSchema } from "@/schema/referralSchema";
import { DiagnosesClient } from "@/components/tables/charts/diagnoses/client";
import { TrashIcon } from "lucide-react";
import { PastDiagnosesInterface } from "@/types/chartsInterface";
import { createTransfer, getEncounterList } from "@/services/chartsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingButton from "@/components/LoadingButton";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { EncounterInterface } from "@/types/encounterInterface";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";

const ReferralOutDialog = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [chartList, setChartList] = useState<EncounterInterface>();
  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<
    PastDiagnosesInterface[]
  >([]);
  const [providerList, setProviderList] = useState<FetchProviderList[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const providerDetails = useSelector((state: RootState) => state.login);

  const handleSelectedDiagnoses = (selected: PastDiagnosesInterface[]) => {
    setSelectedDiagnoses(selected);
  };

  const form = useForm<z.infer<typeof referralOutFormSchema>>({
    resolver: zodResolver(referralOutFormSchema),
    defaultValues: {
      referralTo: "",
      referralReason: "",
      referralDate: new Date().toISOString().split("T")[0],
      priority: "Normal",
      relatedEncounter: "",
      referralNotes: "",
      userDetailsId: "",
    },
  });

  const fetchPatientList = useCallback(async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await fetchUserDataResponse({
        firstName: searchTerm,
        lastName: searchTerm,
      });
      if (response) {
        setPatients(response.data || []);
      }
    } catch (e) {
      console.log("Error", e);
      showToast({ toast, type: "error", message: "Failed to fetch patient" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toast]);

  const fetchProviderList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      if (response) {
        setProviderList(response.data || []);
      }
    } catch (err) {
      console.log(err);
      showToast({
        toast,
        type: "error",
        message: "Failed to fetch owners list.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchEncounterList = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        if (providerDetails) {
          const response = await getEncounterList({
            id: providerDetails.providerId,
            idType: "providerID",
            limit: 2,
            page: page,
          });
          if (response) {
            setChartList(response);
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    },
    [providerDetails]
  );

  const onSubmit = async (values: z.infer<typeof referralOutFormSchema>) => {
    console.log("Form Values:", values);
    const requestData = {
      // referringToProviderID: values.referralTo,
      referringToProviderID: "3abdd291-9a25-4390-8558-0059734de538",
      referringFromProviderID: providerDetails.providerId,
      referralType: "Internal",
      referralReason: values.referralReason,
      priority: values.priority,
      notes: values.referralNotes ?? "",
      relatedEncounterId: values.relatedEncounter,
      diagnoses: selectedDiagnoses.map((diagnosis) => diagnosis.id),
      insuranceId: "",
      attachments: [""],
      userDetailsID: values.userDetailsId,
    };
    setLoading(true);
    try {
      await createTransfer({ requestData: requestData });
      showToast({
        toast,
        type: "success",
        message: "Created Referral successfully!",
      });
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to create Referral.",
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
    }
  };

  useEffect(() => {
    fetchPatientList();
    fetchProviderList();
    fetchEncounterList(1);
  }, [fetchPatientList, fetchProviderList, fetchEncounterList]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    <div>
      <LoadingButton />
    </div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[98rem]">
        <DialogHeader>
          <DialogTitle>Add Referral Out</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={formStyles.formBody}>
              <div className="flex justify-end">
                <div className="flex gap-3">
                  <SubmitButton label="Save" />
                  {/* <Button variant={'outline'}>Preview</Button>  */}
                </div>
              </div>
              <div className="flex flex-col border rounded-lg p-3 gap-5">
                <div className="flex gap-5 w-full">
                  <FormField
                    control={form.control}
                    name="userDetailsId"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formFilterItem}`}>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Search Patient "
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setVisibleSearchList(true);
                              }}
                              className="capitalize"
                            />
                            {searchTerm && visibleSearchList && (
                              <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg  w-full">
                                {filteredPatients.length > 0 ? (
                                  filteredPatients.map((patient) => (
                                    <div
                                      key={patient.id}
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 capitalize"
                                      onClick={() => {
                                        field.onChange(patient.id);
                                        setSearchTerm(
                                          `${patient.user.firstName} ${patient.user.lastName}`
                                        );
                                        setVisibleSearchList(false);
                                      }}
                                    >
                                      {`${patient.user.firstName} ${patient.user.lastName}`}
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-2 text-gray-500">
                                    No results found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className={`${formStyles.formFilterItem}`}>
                    <div className="text-sm font-medium">Referral From:</div>
                    <div>
                      {providerDetails.firstName} {providerDetails.lastName}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="referralTo"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formFilterItem}`}>
                        <FormLabel>Referral To:</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select internal provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectContent>
                                {providerList.map((provider) => (
                                  <SelectItem
                                    key={provider.id}
                                    value={provider.id}
                                  >
                                    {provider.firstName} {provider.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="referralReason"
                  render={({ field }) => (
                    <FormItem className={`${formStyles.formFilterItem}`}>
                      <FormLabel>Referral Reason</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full gap-5">
                  <FormField
                    control={form.control}
                    name="referralDate"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formItem}`}>
                        <FormLabel>Referral Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formFilterItem}`}>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relatedEncounter"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formFilterItem}`}>
                        <FormLabel>Related Encounter:</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select encounter" />
                            </SelectTrigger>
                            <SelectContent>
                              {chartList?.response?.map((chart, index) => (
                                <SelectItem
                                  key={chart?.id ?? `chart-${index}`}
                                  value={chart?.id}
                                >
                                  {chart?.createdAt?.split("T")[0]} {chart?.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="referralNotes"
                  render={({ field }) => (
                    <FormItem className={`${formStyles.formItem}`}>
                      <FormLabel>Referral Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                        {/* <WysiwygComponent value={field.value || ''}
                                                    onChange={(content) => field.onChange(content)} /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full">
                  <div className={`${formStyles.formFilterItem}`}>
                    <div className="flex w-full items-center justify-between">
                      <div>Diagnoses</div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <GhostButton>Choose</GhostButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Diagnoses</DialogTitle>
                            <DiagnosesClient
                              onSelectionChange={handleSelectedDiagnoses}
                              chartID={form.getValues().relatedEncounter}
                            />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div>
                      {selectedDiagnoses.length > 0 ? (
                        <ul>
                          {selectedDiagnoses.map((diagnosis) => (
                            <li key={diagnosis.id}>
                              <div className="flex justify-between">
                                <div>{diagnosis.diagnosis_name} </div>
                                <Button
                                  variant={"ghost"}
                                  onClick={() => {
                                    setSelectedDiagnoses((prevDiagnoses) =>
                                      prevDiagnoses.filter(
                                        (d) => d.id !== diagnosis.id
                                      )
                                    );
                                  }}
                                >
                                  <TrashIcon />{" "}
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No diagnoses selected</div>
                      )}
                    </div>
                  </div>
                  {/* <div className='flex border p-3 w-full items-center justify-between'>
                                        <div>Insurance</div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" className='text-blue-400'>Choose</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Insurance</DialogTitle>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className='flex border p-3 w-full items-center justify-between'>
                                        <div>Attachements</div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className='text-blue-400'>Attach</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        <span>Chart Notes</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span>Face Sheet</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span>Growth Chart</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span>Labs</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span>Images</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span>Patient Documents</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span>From Local Drive</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div> */}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralOutDialog;

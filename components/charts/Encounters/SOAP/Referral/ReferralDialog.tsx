import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { referralFormSchema } from "@/schema/referralSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PastDiagnosesInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransfer, getEncounterList } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "lucide-react";
import { DiagnosesClient } from "@/components/tables/charts/diagnoses/client";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { EncounterInterface } from "@/types/encounterInterface";

const ReferralDialog = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const providerDetails = useSelector((state: RootState) => state.login);
  const [providerList, setProviderList] = useState<FetchProviderList[]>([]);
  const [chartList, setChartList] = useState<EncounterInterface>();
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<
    PastDiagnosesInterface[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectedDiagnoses = (selected: PastDiagnosesInterface[]) => {
    setSelectedDiagnoses(selected);
  };

  const form = useForm<z.infer<typeof referralFormSchema>>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      referralTo: "",
      referralReason: "",
      referralFrom: providerDetails.providerId,
      userDetailsId: patientDetails.userDetails.userDetailsId,
      referralDate: new Date().toISOString().split("T")[0],
      priority: "Normal",
      relatedEncounter: "",
      referralNotes: "",
    },
  });

  const fetchProviderList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      if (response) {
        setProviderList(response.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEncounterList = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        if (providerDetails) {
          const response = await getEncounterList({
            id: providerDetails.providerId,
            idType: "providerID",
            limit: 2,
            page,
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

  const onSubmit = async (values: z.infer<typeof referralFormSchema>) => {
    console.log("Form Values:", values);
    const requestData = {
      referringToProviderID: values.referralTo,
      referringFromProviderID: providerDetails.providerId,
      referralType: "Internal",
      referralReason: values.referralReason,
      priority: values.priority,
      notes: values.referralNotes ?? "",
      relatedEncounterId: encounterId,
      diagnoses: selectedDiagnoses.map((diagnosis) => diagnosis.id),
      insuranceId: "",
      attachments: [""],
      userDetailsID: patientDetails.userDetails.userDetailsId,
    };
    setLoading(true);
    try {
      await createTransfer({ requestData });
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchEncounterList(1);
    fetchProviderList();
  }, [fetchEncounterList, fetchProviderList]);

  if (loading) {
    <div>
      <LoadingButton />
    </div>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Add Referral </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[98rem]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {patientDetails && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <div>Add Referral Out</div>
                  <div className="flex gap-3">
                    {/* <Button type='submit' className='bg-[#84012A]'>Save</Button> */}
                    {/* <Button variant={'outline'}>Preview</Button>  */}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex w-full">
                    <div className="flex flex-col border p-3 w-full">
                      <div>Patient</div>
                      <div>
                        {patientDetails?.userDetails?.firstName}{" "}
                        {patientDetails?.userDetails?.lastName}
                      </div>
                    </div>
                    <div className="flex flex-col border p-3 w-full">
                      <div>Referral From</div>
                      <div>
                        {providerDetails.firstName} {providerDetails.lastName}
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="referralTo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col border p-3 w-full">
                          <FormLabel>Referral To</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select internal provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {providerList.map((provider) => (
                                  <SelectItem
                                    key={provider.id}
                                    value={provider.providerDetails?.id ?? ""}
                                  >
                                    {provider.firstName} {provider.lastName}
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
                  <div className="flex flex-col border p-2 w-full">
                    <FormField
                      control={form.control}
                      name="referralReason"
                      render={({ field }) => (
                        <FormItem className="flex gap-2">
                          <FormLabel>Referral Reason</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter reason" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex w-full justify-between">
                      <FormField
                        control={form.control}
                        name="referralDate"
                        render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
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
                          <FormItem>
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
                                  {chartList?.response?.map((chart) => (
                                    <SelectItem
                                      key={chart?.id}
                                      value={chart?.id}
                                    >
                                      {chart?.createdAt.split("T")[0]}{" "}
                                      {chart?.id}
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
                  </div>
                  <FormField
                    control={form.control}
                    name="referralNotes"
                    render={({ field }) => (
                      <FormItem>
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
                    <div className="flex w-full flex-col gap-3  border p-3 ">
                      <div className="flex w-full items-center justify-between">
                        <div>Diagnoses</div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant={"ghost"}> Choose</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Diagnoses</DialogTitle>
                              <DialogDescription></DialogDescription>
                              <DiagnosesClient
                                onSelectionChange={handleSelectedDiagnoses}
                                chartID={patientDetails?.chart?.id}
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
                                  <div>{diagnosis.type.diagnosis_name} </div>
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
                                                    <DialogDescription></DialogDescription>
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
              <Button
                type="submit"
                onClick={() => {
                  console.log(form.getValues());
                }}
              >
                Save
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReferralDialog;

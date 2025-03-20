import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { vaccinesSource } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { vaccinesFormSchema } from "@/schema/vaccinesSchema";
import {
  createHistoricalVaccine,
  updateHistoricalVaccine,
} from "@/services/chartDetailsServices";
import { getVaccinesType } from "@/services/injectionsServices";
import { RootState } from "@/store/store";
import {
  CreateHistoricalVaccineType,
  HistoricalVaccineInterface,
} from "@/types/chartsInterface";
import { VaccinesTypesInterface } from "@/types/injectionsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function VaccinesDialog({
  isOpen,
  userDetailsId,
  vaccinesData,
  onClose,
  onFetchHistoricalData,
}: {
  isOpen: boolean;
  userDetailsId: string;
  vaccinesData?: HistoricalVaccineInterface | null;
  onClose: () => void;
  onFetchHistoricalData: () => void;
}) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Vaccines Types State
  const [vaccinesTypes, setVaccinesTypes] = useState<VaccinesTypesInterface[]>(
    []
  );

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  // GET Vaccines Types
  const fetchVaccineTypes = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getVaccinesType({
        search: searchTerm,
        limit: 10,
      });

      if (response) {
        setVaccinesTypes(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch vaccines types",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toast]);

  // Form State
  const form = useForm<z.infer<typeof vaccinesFormSchema>>({
    resolver: zodResolver(vaccinesFormSchema),
    defaultValues: {
      vaccine_name: vaccinesData?.vaccine_name ?? "",
      in_series: vaccinesData?.in_series ?? "",
      date: vaccinesData?.date
        ? formatDate(vaccinesData.date)
        : new Date().toISOString().split("T")[0],
      source: vaccinesData?.source ?? "",
      notes: vaccinesData?.notes ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof vaccinesFormSchema>) => {
    const finalVaccineData: CreateHistoricalVaccineType = {
      ...values,
      userDetailsId,
      providerId: providerDetails.providerId,
    };

    setLoading(true);
    try {
      if (providerDetails) {
        if (vaccinesData) {
          await updateHistoricalVaccine({
            id: vaccinesData.id,
            requestData: finalVaccineData,
          });
        } else {
          await createHistoricalVaccine({ requestData: finalVaccineData });
        }
      }

      showToast({
        toast,
        type: "success",
        message: vaccinesData
          ? "Vaccine updated successfully"
          : "Vaccine created successfully",
      });
    } catch (e) {
      if (e instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Vaccine creation failed",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Vaccine creation failed. An unknown error occurred",
        });
      }
    } finally {
      form.reset();
      setLoading(false);
      setSearchTerm("");
      onFetchHistoricalData();
      onClose();
    }
  };

  useEffect(() => {
    if (vaccinesData) {
      form.reset(vaccinesData);
      setSearchTerm(vaccinesData.vaccine_name);
    }
  }, [form, vaccinesData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchVaccineTypes();
      } else {
        setVaccinesTypes([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchVaccineTypes]);

  const filteredVaccineTypes = vaccinesTypes.filter((vaccine) =>
    vaccine.vaccine_name.toLocaleLowerCase().includes(searchTerm)
  );

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>
            {vaccinesData ? "Edit Vaccine" : "Add vaccine"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="vaccine_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaccine</FormLabel>
                    <FormControl>
                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="relative">
                          <Input
                            value={searchTerm}
                            placeholder="Search by name or code"
                            className="w-full"
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setIsListVisible(true);
                            }}
                            disabled={vaccinesData ? true : false}
                          />
                          {searchTerm && isListVisible && (
                            <div className="absolute bg-white border border-gray-200 text-sm font-medium mt-1 rounded shadow-md w-full">
                              {filteredVaccineTypes.length > 0 ? (
                                filteredVaccineTypes.map((vaccineType) => (
                                  <div
                                    key={vaccineType.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      field.onChange(vaccineType.vaccine_name);
                                      setSearchTerm(vaccineType.vaccine_name);
                                      setIsListVisible(false);
                                    }}
                                  >
                                    {vaccineType.vaccine_name}
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
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="in_series"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-fit"># in Series</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date:</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-fit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-fit">Source</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Source" />
                        </SelectTrigger>
                        <SelectContent>
                          {vaccinesSource.map((source) => (
                            <SelectItem
                              key={source}
                              value={source}
                              className="cursor-pointer"
                            >
                              {source}
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
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex justify-end gap-2 w-fit">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <SubmitButton label="Save" disabled={loading} />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default VaccinesDialog;

import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
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
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addPharmacyFormSchema } from "@/schema/addPharmacySchema";
import {
  addPharmacyData,
  getPharmacyData,
} from "@/services/chartDetailsServices";
import { PharmacyInterface } from "@/types/pharmacyInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import formStyles from "@/components/formStyles.module.css";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

interface PharmacyDialogInterface {
  isOpen: boolean;
  userDetailsId: string;
  onClose: () => void;
}

function PharmacyDialog({
  isOpen,
  userDetailsId,
  onClose,
}: PharmacyDialogInterface) {
  // Data States
  const [originalData, setOriginalData] = useState<PharmacyInterface[]>([]);
  const [filteredData, setFilteredData] = useState<PharmacyInterface[]>([]);

  // Loading State
  const [isLoading, setIsLoading] = useState({ get: false, post: false });

  // Pagination States
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof addPharmacyFormSchema>>({
    resolver: zodResolver(addPharmacyFormSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
  });

  // GET Pharmacy Data
  const fetchPharmacyData = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, get: true }));

    try {
      const response = await getPharmacyData();
      setOriginalData(response);
      setFilteredData(response);
    } catch (err) {
      console.error("Error fetching pharmacy data:", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, get: false }));
    }
  }, []);

  // Filter Using Query Params
  const onSubmit = (values: z.infer<typeof addPharmacyFormSchema>) => {
    const noSearchParams =
      !values.name &&
      !values.city &&
      !values.state &&
      !values.zip &&
      !values.phone;

    if (noSearchParams) {
      setFilteredData(originalData);
      setCurrentPage(1);
      return;
    }

    const filtered = originalData.filter((pharmacy) => {
      return (
        (!values.name ||
          pharmacy.name.toLowerCase().includes(values.name.toLowerCase())) &&
        (!values.city ||
          pharmacy.address.toLowerCase().includes(values.city.toLowerCase())) &&
        (!values.state ||
          pharmacy.state.toLowerCase().includes(values.state.toLowerCase())) &&
        (!values.zip || pharmacy.zipCode.includes(values.zip)) &&
        (!values.phone || pharmacy.phoneNumber.includes(values.phone))
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchPharmacyData();
  }, [fetchPharmacyData]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Remove duplicate state names
  const uniqueStates = Array.from(
    new Set(filteredData.map((pharmacy) => pharmacy.state))
  );

  // POST Pharmacy Data
  const handleAdd = async (row: PharmacyInterface) => {
    try {
      setIsLoading((prev) => ({ ...prev, post: true }));

      if (userDetailsId) {
        const pharmacyData = {
          ...row,
          userDetailsID: userDetailsId,
        };

        await addPharmacyData(pharmacyData);

        showToast({
          toast,
          type: "success",
          message: "Pharmacy added successfully",
        });
      } else {
        throw new Error("User ID is missing");
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not add selected pharmacy",
        });
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, post: false }));
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Pharmacy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[30rem] h-auto">
          <div className={formStyles.formBody}>
            {/* Search Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Search Pharmacy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
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
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <SubmitButton label="Search" />
                </div>
              </form>
            </Form>

            {/* Results Table */}
            {isLoading.get || isLoading.post ? (
              <LoadingButton />
            ) : filteredData.length === 0 ? (
              <p className="border border-red-100 bg-red-50 w-fit px-2 py-1 rounded-md text-xs text-red-500 font-medium">No pharmacies found.</p>
            ) : (
              <div className="mt-6">
                <DefaultDataTable
                  columns={columns(handleAdd)}
                  data={paginatedData}
                  pageNo={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default PharmacyDialog;

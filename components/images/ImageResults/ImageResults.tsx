import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
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
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import { getImageResults } from "@/services/imageResultServices";
import { ImageResultResponseInterface } from "@/types/imageResults";
import { filterImageResultsSchema } from "@/schema/createImageResultsSchema";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import { usePathname, useRouter } from "next/navigation";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";
import { imagesStatus } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

interface ImageResultsProps {
  userDetailsId?: string;
}

function ImageResults({ userDetailsId }: ImageResultsProps) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Image Results State
  const [resultList, setResultList] = useState<ImageResultResponseInterface>();

  // Patient State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  //Search States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();
  const pathname = usePathname();

  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof filterImageResultsSchema>>({
    resolver: zodResolver(filterImageResultsSchema),
    defaultValues: {
      status: "",
      name: userDetailsId ?? "",
    },
  });

  const filters = form.watch();

  const goToCreateImage = () => {
    sessionStorage.setItem("image-origin", pathname);
    router.push("/dashboard/provider/images/create_image_results");
  };

  // GET Patients Data
  const fetchPatientData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchUserDataResponse({
        pageNo: 1,
        pageSize: 10,
        firstName: searchTerm,
        lastName: searchTerm,
      });

      if (response) {
        setPatientData(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch patients",
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

  const fetchImageResultsList = useCallback(
    async (page: number) => {
      try {
        setDataLoading(true);
        const limit = 5;
        if (providerDetails) {
          const response = await getImageResults({
            providerId: providerDetails.providerId,
            userDetailsId: filters.name,
            status: filters.status === "all" ? "" : filters.status,
            limit,
            page,
          });
          if (response) {
            setResultList(response);
            setTotalPages(Math.ceil(response.total / limit));
          }
          setDataLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setDataLoading(false);
      }
    },
    [filters.name, filters.status, providerDetails]
  );

  // Patient useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchPatientData();
      } else {
        setPatientData([]);
        setSelectedUser(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchPatientData]);

  // Filter Patients
  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Image Results useEffect
  useEffect(() => {
    fetchImageResultsList(page);
  }, [page, fetchImageResultsList]);

  return (
    <>
      <Form {...form}>
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {imagesStatus.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!userDetailsId && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="flex gap-2 border pr-2 rounded-md items-baseline">
                        <Input
                          placeholder="Search Patient "
                          value={searchTerm}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);
                            setVisibleSearchList(true);

                            if (!value) {
                              field.onChange("");
                            }
                          }}
                          className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                        />
                        <div className="px-3 py-1 text-base">
                          {" "}
                          {selectedUser?.patientId}
                        </div>
                      </div>
                      {searchTerm && visibleSearchList && (
                        <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg z-[100] w-full">
                          {loading ? (
                            <div>Loading...</div>
                          ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                              <div
                                key={patient.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  field.onChange(patient.id);
                                  setSearchTerm(
                                    `${patient.user.firstName} ${patient.user.lastName}`
                                  );
                                  setVisibleSearchList(false);
                                  setSelectedUser(patient);
                                }}
                              >
                                {`${patient.user.firstName} ${patient.user.lastName} - ${patient.patientId}`}
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
          )}
        </form>
      </Form>
      {dataLoading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          // onAddClick={goToCreateImage}
          columns={columns()}
          data={resultList?.data || []}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </>
  );
}

export default ImageResults;

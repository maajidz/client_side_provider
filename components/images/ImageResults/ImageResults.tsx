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
import LoadingButton from "@/components/LoadingButton";
import { getImageResults } from "@/services/imageResultServices";
import { ImageResultResponseInterface } from "@/types/imageResults";
import { filterImageResultsSchema } from "@/schema/createImageResultsSchema";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import { useRouter } from "next/navigation";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";
import { imagesStatus } from "@/constants/data";

interface ImageResultsProps {
  userDetailsId?: string;
}

function ImageResults({ userDetailsId }: ImageResultsProps) {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<ImageResultResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  // Patient State
  const [patientData, setPatientData] = useState<UserData[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  const form = useForm<z.infer<typeof filterImageResultsSchema>>({
    resolver: zodResolver(filterImageResultsSchema),
    defaultValues: {
      status: "",
      name: userDetailsId ?? "",
    },
  });

  const filters = form.watch();

  const fetchImageResultsList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
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
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [filters.name, filters.status, providerDetails]
  );

  // GET Patients' Data
  const fetchPatientData = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetchUserDataResponse({ pageNo: currentPage });
      if (response) {
        setPatientData(response.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImageResultsList(page);
    fetchPatientData(page);
  }, [page, fetchImageResultsList, fetchPatientData]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                      <Input
                        placeholder="Search Patient"
                        value={searchTerm}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchTerm(value);
                          setVisibleSearchList(true);

                          if (!value) {
                            field.onChange("");
                          }
                        }}
                      />

                      {/* Loading Button */}
                      {loading && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <LoadingButton />
                        </div>
                      )}

                      {searchTerm && visibleSearchList && (
                        <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg z-[100] w-full">
                          {filteredPatients.length > 0 ? (
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
          )}
        </form>
      </Form>
      {loading && <TableShimmer />}
      {!loading && resultList?.data && (
        <DefaultDataTable
          title={"Image Results"}
          onAddClick={() => {
            router.push("/dashboard/provider/images/create_image_results");
          }}
          columns={columns()}
          data={resultList?.data}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default ImageResults;

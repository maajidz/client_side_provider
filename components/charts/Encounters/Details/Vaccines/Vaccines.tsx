import React, { useCallback, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VaccinesDialog from "./VaccinesDialog";
import {
  HistoricalVaccineInterface,
  HistoricalVaccineResponseInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  deleteHistoricalVaccine,
  getHistoricalVaccine,
} from "@/services/chartDetailsServices";
import { useToast } from "@/hooks/use-toast";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { showToast } from "@/utils/utils";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const Vaccines = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  // Historical Vaccine State
  const [historicalVaccineData, setHistoricalVaccineData] =
    useState<HistoricalVaccineResponseInterface>();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editData, setEditData] = useState<
    HistoricalVaccineInterface | undefined
  >(undefined);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getHistoricalVaccine({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });

      if (response) {
        setHistoricalVaccineData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching historical vaccine data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.userDetailsId, page, limit, toast]);

  const handleAccordionChange = (value: string | null) => {
    if (value === "vaccines") {
      fetchHistoricalVaccine();
    }
  };

  // Handle Delete Historical Vaccine
  const handleDeleteHistoricalVaccine = async (id: string) => {
    setLoading(true);

    try {
      await deleteHistoricalVaccine({ id });
      showToast({
        toast,
        type: "success",
        message: "Historical vaccine deleted successfully",
      });
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: "Could not delete historical vaccine",
      });
    } finally {
      setLoading(false);
      fetchHistoricalVaccine();
    }
  };

  // Define columns inline since we need specialized columns for this component
  const columns: ColumnDef<HistoricalVaccineInterface>[] = [
    {
      accessorKey: "vaccine_name",
      header: "Vaccine Name",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue("vaccine_name")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue("date")}</div>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.getValue("source") || "Not specified"}
        </div>
      ),
    },
    {
      accessorKey: "in_series",
      header: "# In Series",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.getValue("in_series") || "Not specified"}
        </div>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.getValue("notes") || "No notes"}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={16} className="text-gray-500"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditData(row.original);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleDeleteHistoricalVaccine(row.original.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="vaccines">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Vaccines</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(undefined);
                setIsDialogOpen(true);
              }}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <VaccinesDialog
              key={isDialogOpen ? "dialog-open" : "dialog-closed"}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                fetchHistoricalVaccine();
                setEditData(undefined);
              }}
              vaccinesData={editData}
              onFetchHistoricalData={fetchHistoricalVaccine}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <div className="flex flex-col gap-2">
                {historicalVaccineData?.data && historicalVaccineData.data.length > 0 ? (
                  <DefaultDataTable
                    title="Vaccines"
                    columns={columns}
                    data={historicalVaccineData.data}
                    pageNo={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    onAddClick={() => {
                      setEditData(undefined);
                      setIsDialogOpen(true);
                    }}
                    className="mt-4"
                  />
                ) : (
                  <div className="text-center">No Vaccine data found!</div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Vaccines;

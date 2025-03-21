import React, { useCallback, useEffect, useState } from "react";
import ProceduresSurgeriesAndHospitalizationDialog from "./ProceduresSurgeriesAndHospitalizationDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  deleteProcedure,
  getProcedureData,
} from "@/services/chartDetailsServices";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import {
  ProcedureResponse,
  UpdateProceduresInterface,
} from "@/types/procedureInterface";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProceduresSurgeriesAndHospitalization = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<ProcedureResponse>();
  const [editData, setEditData] = useState<UpdateProceduresInterface | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProcedureData({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });
      if (response) {
        setData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  const handleDeleteProcedure = async (alertId: string) => {
    setLoading(true);
    try {
      await deleteProcedure({ id: alertId });
      showToast({
        toast,
        type: "success",
        message: `Procedure deleted successfully`,
      });
    } catch (e) {
      showToast({ toast, type: "error", message: `Error` });
      console.log("Error:", e);
    } finally {
      fetchProcedures();
      setLoading(false);
    }
  };

  // Define columns for the procedures table
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold capitalize">
          {row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "nameType.name",
      header: "Name",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.nameType.name}
        </div>
      ),
    },
    {
      accessorKey: "fromDate",
      header: "From Date",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.fromDate.split("T")[0]}
        </div>
      ),
    },
    {
      accessorKey: "toDate",
      header: "To Date",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.toDate?.split("T")[0] ?? ""}
        </div>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.notes}
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
              <EllipsisVertical size={16} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditData({
                    id: row.original.id,
                    type: row.original.type,
                    nameId: row.original.nameId,
                    fromDate: row.original.fromDate,
                    toDate: row.original.toDate,
                    notes: row.original.notes,
                    userDetailsId: patientDetails.userDetails.userDetailsId,
                    nameType: {
                      id: row.original.nameType.id,
                      createdAt: row.original.nameType.createdAt,
                      updatedAt: row.original.nameType.createdAt,
                      description: row.original.nameType.description,
                      name: row.original.nameType.name,
                    },
                  });
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteProcedure(row.original.id)}
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
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="proceduresSurgeriesAndHospitalizationDialog">
          <div className="flex justify-between items-center">
            <AccordionTrigger>
              Procedures, Surgeries, and Hospitalization
            </AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <ProceduresSurgeriesAndHospitalizationDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              procedureData={editData}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                fetchProcedures();
                setEditData(null);
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <div className="flex flex-col gap-2">
                {data?.data && data.data.length > 0 ? (
                  <DefaultDataTable
                    title="Procedures"
                    columns={columns}
                    data={data.data}
                    pageNo={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    // onAddClick={() => {
                    //   setEditData(null);
                    //   setIsDialogOpen(true);
                    // }}
                    className="mt-4"
                  />
                ) : (
                  <div className="text-center">No procedures found!</div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProceduresSurgeriesAndHospitalization;

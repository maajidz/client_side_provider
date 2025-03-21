import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Edit2Icon,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InjectionsDialog from "./InjectionsDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  InjectionsData,
  InjectionsResponse,
} from "@/types/injectionsInterface";
import { useToast } from "@/hooks/use-toast";
import { deleteInjection, getInjection } from "@/services/injectionsServices";
import { showToast } from "@/utils/utils";
import FormLabels from "@/components/custom_buttons/FormLabels";
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
import { EllipsisVertical } from "lucide-react";

const Injections = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [injectionsData, setInjectionsData] = useState<InjectionsResponse>();
  const [editData, setEditData] = useState<InjectionsData | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInjection({
        page: page,
        limit: limit,
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });

      if (response) {
        setInjectionsData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit]);

  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData]);

  const handleDeleteInjection = async (injectionId: string) => {
    setLoading(true);
    try {
      await deleteInjection({ injectionId: injectionId });
      showToast({
        toast,
        type: "success",
        message: `Injection deleted successfully`,
      });
      fetchInjectionsData();
    } catch (e) {
      showToast({ toast, type: "error", message: `Error` });
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Define columns inline
  const columns: ColumnDef<InjectionsData>[] = [
    {
      accessorKey: "injectionType.injection_name",
      header: "Injection Name",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.original.injectionType.injection_name}</div>
      ),
    },
    {
      accessorKey: "dosage_quantity",
      header: "Dosage",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.dosage_quantity} {row.original.dosage_unit}
        </div>
      ),
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.original.frequency}</div>
      ),
    },
    {
      accessorKey: "site",
      header: "Site",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.original.site}</div>
      ),
    },
    {
      accessorKey: "administered_date",
      header: "Administered Date",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.administered_date.split("T")[0]}
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
                  handleDeleteInjection(row.original.id);
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
    <>
      <div className="flex flex-col gap-3 group">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="injections">
            <div className="flex justify-between items-center">
              <AccordionTrigger>Injections</AccordionTrigger>
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
              <InjectionsDialog
                userDetailsId={patientDetails.userDetails.userDetailsId}
                injectionsData={editData}
                onClose={() => {
                  setIsDialogOpen(false);
                  fetchInjectionsData();
                  setEditData(null);
                }}
                isOpen={isDialogOpen}
              />
            </div>
            <AccordionContent className="sm:max-w-4xl">
              {loading ? (
                <AccordionShimmerCard />
              ) : (
                <div className="flex flex-col gap-2">
                  {injectionsData?.data && injectionsData.data.length > 0 ? (
                    <DefaultDataTable
                      title="Injections"
                      columns={columns}
                      data={injectionsData.data}
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
                    <div className="text-center">No injections data found</div>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Injections;

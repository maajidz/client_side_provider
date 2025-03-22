import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { deleteUserPharmacyData, getUserPharmacyData } from "@/services/chartDetailsServices";
import PharmacyDialog from "./PharmacyDialog";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
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

interface PharmacyProps {
  patientDetails: UserEncounterData;
}

const Pharmacy = ({ patientDetails }: PharmacyProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data States
  const [pharmacyData, setPharmacyData] = useState<UserPharmacyInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // GET User Pharmacy
  const fetchUserPharmacy = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getUserPharmacyData({
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });

      if (response) {
        setPharmacyData(response);
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching pharmacy data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, toast]);

  // Effects
  useEffect(() => {
    fetchUserPharmacy();
  }, [fetchUserPharmacy]);

  const handleDeleteUserPharmacy = async (pharmacyId: string) => {
    setLoading(true);

    try {
      await deleteUserPharmacyData({ pharmacyId });

      showToast({
        toast,
        type: "success",
        message: `Pharmacy deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Pharmacy delete failed`,
        });
    } finally {
      setLoading(false);
      await fetchUserPharmacy();
    }
  };

  // Define columns for the pharmacy table
  const columns: ColumnDef<UserPharmacyInterface>[] = [
    {
      accessorKey: "name",
      header: "Pharmacy Name",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="cursor-pointer text-sm text-gray-700">
          <span className="font-semibold">
            {row.original.address}
          </span>
          {" - "}
          <span>
            {row.original.city}, {row.original.state}, {row.original.country}
          </span>
          {", "}
          <span>{row.original.zipCode}</span>
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.phoneNumber}
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
                onClick={() => handleDeleteUserPharmacy(row.original.id)}
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
        <AccordionItem value="pharmacy">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Pharmacy</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <PharmacyDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
                fetchUserPharmacy();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <>
                {pharmacyData !== undefined ? (
                  <div className="flex flex-col gap-2">
                    <DefaultDataTable
                      // title="Pharmacy"
                      columns={columns}
                      data={[pharmacyData]}
                      pageNo={1}
                      totalPages={1}
                      onPageChange={() => {}}
                      // onAddClick={() => setIsDialogOpen(true)}
                      className="mt-4"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    No pharmacy data available
                  </div>
                )}
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Pharmacy;

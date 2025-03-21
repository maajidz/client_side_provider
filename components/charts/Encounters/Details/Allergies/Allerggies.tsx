import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteAllergies,
  getAllergiesData,
} from "@/services/chartDetailsServices";
import { AllergenResponseInterfae } from "@/types/allergyInterface";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import AllergiesDialog from "./AllergiesDialog";
import EditAllergy from "./EditAllergy";
import {
  PlusCircle,
  EllipsisVertical
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

const Allergies = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allergies, setAllergies] = useState<AllergenResponseInterfae[]>([]);
  const [selectedAllergy, setSelectedAllergy] = useState<AllergenResponseInterfae | null>(null);
  const [error, setError] = useState("");

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // Fetch Allergies
  const fetchAllergies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllergiesData({
        limit: limit,
        page: page,
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });
      if (response) {
        setAllergies(response);
        setTotalPages(Math.ceil(response.length / limit));}
    } catch (e) {
      if (e instanceof Error)
        setError("Something went wrong when fetching allergies");
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.userDetailsId, page]);

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  // Delete Allergy
  const handleDeleteAllergy = async (allergyId: string) => {
    setLoading(true);

    try {
      await deleteAllergies({ allergyId });

      showToast({
        toast,
        type: "success",
        message: `Allergy deleted successfully`,
      });

      fetchAllergies();
    } catch (e) {
      if (e instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Allergy delete failed`,
        });
    } finally {
      setLoading(false);
    }
  };

  // Define the columns for the allergies table
  const columns: ColumnDef<AllergenResponseInterfae>[] = [
    {
      accessorKey: "allergen",
      header: "Allergen",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue("allergen")}</div>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue("severity")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "observedOn",
      header: "Observed On",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <div className="cursor-pointer">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "reactions",
      header: "Reactions",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.reactions.map((reaction) => (
            <div key={reaction.id}>{reaction.name}</div>
          ))}
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
                  setSelectedAllergy(row.original);
                  setIsEditDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteAllergy(row.original.id)}
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
        <AccordionItem value="allergies">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Allergies</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <AllergiesDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
                fetchAllergies();
              }}
              isOpen={isDialogOpen}
            />
            {selectedAllergy && (
              <EditAllergy
                onClose={() => {
                  setIsEditDialogOpen(false);
                  setSelectedAllergy(null);
                }}
                isOpen={isEditDialogOpen}
                selectedAllergy={selectedAllergy}
                fetchAllergies={fetchAllergies}
              />
            )}
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : error ? (
              <p className="text-center">{error}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {allergies && allergies.length > 0 ? (
                  <DefaultDataTable
                    title="Allergies"
                    columns={columns}
                    data={allergies}
                    pageNo={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    onAddClick={() => setIsDialogOpen(true)}
                    className="mt-4"
                  />
                ) : (
                  <p className="text-center">No allergies data found</p>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Allergies;

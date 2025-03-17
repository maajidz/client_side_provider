import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "@/components/LoadingButton";
import FormLabels from "@/components/custom_buttons/FormLabels";
import {
  deleteAllergies,
  getAllergiesData,
} from "@/services/chartDetailsServices";
import { AllergenResponseInterfae } from "@/types/allergyInterface";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import AllergiesDialog from "./AllergiesDialog";
import EditAllergy from "./EditAllergy";
import { Edit2, PlusCircle, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Allergies = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allergies, setAllergies] = useState<AllergenResponseInterfae[]>([]);
  const [error, setError] = useState("");

  const { toast } = useToast();

  // Fetch Allergies
  const fetchAllergies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllergiesData({
        limit: 10,
        page: 1,
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });
      if (response) {
        setAllergies(response);
      }
    } catch (e) {
      if (e instanceof Error)
        setError("Something went wrong when fetching allergies");
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.userDetailsId]);

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  if (loading) {
    return <LoadingButton />;
  }

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

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="allergies">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Allergies</AccordionTrigger>
            <Button variant="ghost" onClick={() => setIsDialogOpen(true)}
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
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {allergies && allergies.length !== 0 ? (
              allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="flex flex-col gap-2 p-2 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold">
                      {allergy?.allergen}
                    </div>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditDialogOpen(true)}
                      >
                        <Edit2 color="#84012A" />
                      </Button>
                      <EditAllergy
                        onClose={() => {
                          setIsEditDialogOpen(false);
                        }}
                        isOpen={isEditDialogOpen}
                        selectedAllergy={allergy}
                        fetchAllergies={fetchAllergies}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteAllergy(allergy.id)}
                      >
                        <Trash2Icon color="#84012A" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <FormLabels
                      label="Observed On"
                      value={new Date(allergy.observedOn).toLocaleDateString()}
                    />
                    <FormLabels label="Severity" value={allergy.severity} />
                    <FormLabels label="Status" value={allergy.status} />
                    <FormLabels
                      label="Reaction"
                      value={allergy.reactions.map((reaction) => (
                        <div key={reaction.name}>{reaction.name} </div>
                      ))}
                    />
                  </div>
                </div>
              ))
            ) : error ? (
              <p className="text-center">{error}</p>
            ) : (
              <p className="text-center">No allergies data found</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Allergies;

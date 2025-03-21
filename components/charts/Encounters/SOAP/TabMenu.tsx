import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
import {
  PatientPhysicalStats,
  UserEncounterData,
} from "@/types/chartsInterface";
// import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import {
  createSOAPChart,
  updatePatientPhysicalStatus,
  updateSOAPChart,
} from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";

interface TabMenuProps {
  patientDetails: UserEncounterData;
  encounterId: string;
  subjectiveContent: string;
  objectiveContent: string;
  physicalStatsContent: PatientPhysicalStats;
  onRefresh: React.Dispatch<React.SetStateAction<number>>;
  setSigned: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabMenu: React.FC<TabMenuProps> = ({
  patientDetails,
  encounterId,
  subjectiveContent,
  objectiveContent,
  physicalStatsContent,
  onRefresh,
  setSigned,
}) => {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setSigned(isSigned);
  }, [isSigned, setSigned, setIsSigned]);

  const handleSOAPSave = async () => {
    try {
      setLoading(true);

      const requestBody = {
        subjective: subjectiveContent,
        objective: objectiveContent,
        encounterId: encounterId,
      };

      if (patientDetails.chart?.id) {
        await updateSOAPChart({
          requestData: requestBody,
          chartId: patientDetails.chart.id,
        });
        if (physicalStatsContent.height && physicalStatsContent.weight) {
          await updatePatientPhysicalStatus({
            userDetailsID: patientDetails.userDetails.userDetailsId,
            requestData: {
              height: Number(physicalStatsContent.height),
              weight: Number(physicalStatsContent.weight),
            },
          });
        }
        showToast({
          toast,
          type: "success",
          message: "Content saved successfully",
        });
      } else {
        const createRequestBody = {
          ...requestBody,
          encounterId: encounterId,
        };
        await createSOAPChart({ requestData: createRequestBody });
        if (physicalStatsContent.height && physicalStatsContent.weight) {
          await updatePatientPhysicalStatus({
            userDetailsID: patientDetails.userDetails.userDetailsId,
            requestData: {
              height: Number(physicalStatsContent.height),
              weight: Number(physicalStatsContent.weight),
            },
          });
        }
        showToast({
          toast,
          type: "success",
          message: "Content saved successfully",
        });
      }
    } catch (e) {
      console.error("Error saving content:", e);
      showToast({ toast, type: "error", message: "Error saving content" });
    } finally {
      setLoading(false);
      onRefresh((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row gap-2">
      {patientDetails.chart === null ? (
        <div> </div>
      ) : (
        <Button onClick={handleSOAPSave} disabled={isSigned}>Save</Button>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="px-2">
            <Icon name="preview" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Preview SOAP Note</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div>Subjective</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: patientDetails.chart?.subjective || "",
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>Objective</div>
              <div>{patientDetails.chart?.objective}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Assessment</div>
              <div>{patientDetails.chart?.assessment}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Plan</div>
              <div>{patientDetails.chart?.plan}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        variant={"outline"}
        className=""
        onClick={() => setIsSigned((prev) => !prev)}
      >
        {isSigned ? "Unsign":"Sign"}
      </Button>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="px-2">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Print Patient Summary</DropdownMenuItem>
          <DropdownMenuItem>Print Chart Notes</DropdownMenuItem>
          <DropdownMenuItem>Import Medical History</DropdownMenuItem>
          <DropdownMenuItem>Import Family History</DropdownMenuItem>
          <DropdownMenuItem>Import Social History</DropdownMenuItem>
          <DropdownMenuItem>Import Images</DropdownMenuItem>
          <DropdownMenuItem>Reports</DropdownMenuItem>
          <DropdownMenuItem>File For Review</DropdownMenuItem>
          <DropdownMenuItem>Quick Message</DropdownMenuItem>
          <DropdownMenuItem>Surveillance Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};

export default TabMenu;

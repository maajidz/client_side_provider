import { RootState } from "@/store/store";
import AddDiagnosesDialog from "./AddDiagnosesDialog";
import DiagnosesClient from "./client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

const PatientDiagnoses = ({ userDetailsId }: { userDetailsId: string }) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Chart State
  const chartId = useSelector((state: RootState) => state.user.chartId);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Heading title="Diagnoses" description="" />
          <Button onClick={() => setIsDialogOpen(true)}>
            New Diagnoses
            <PlusIcon />
          </Button>
        </div>
        <div className="flex gap-6 flex-col">
          <DiagnosesClient
            userDetailsId={userDetailsId}
            refreshTrigger={refreshTrigger}
          />

          {/* Add Diagnoses */}
          <AddDiagnosesDialog
            isOpen={isDialogOpen}
            userDetailsId={userDetailsId}
            chartId={chartId}
            onClose={handleDialogClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDiagnoses;

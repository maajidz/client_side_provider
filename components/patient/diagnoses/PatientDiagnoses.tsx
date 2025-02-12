import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import PageContainer from "@/components/layout/page-container";
import { RootState } from "@/store/store";
import AddDiagnosesDialog from "./AddDiagnosesDialog";
import DiagnosesClient from "./client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

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
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <DefaultButton onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Diagnoses
          </DefaultButton>
        </div>
        <div className="space-y-3">
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
    </PageContainer>
  );
};

export default PatientDiagnoses;

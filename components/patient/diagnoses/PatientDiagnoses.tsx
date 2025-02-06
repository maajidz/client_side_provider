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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Chart State
  const chartId = useSelector((state: RootState) => state.user.chartId);

  return (
    <PageContainer scrollable={true}>
      <div className="flex justify-end">
        <DefaultButton onClick={() => setIsDialogOpen(true)}>
          <PlusIcon />
          Diagnoses
        </DefaultButton>
      </div>
      <div className="space-y-3">
        <DiagnosesClient userDetailsId={userDetailsId} />

        {/* Add Diagnoses */}
        <AddDiagnosesDialog
          isOpen={isDialogOpen}
          userDetailsId={userDetailsId}
          chartId={chartId}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </PageContainer>
  );
};

export default PatientDiagnoses;

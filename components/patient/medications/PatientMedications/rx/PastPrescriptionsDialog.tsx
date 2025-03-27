import RxPatientDetailsSection from "@/components/charts/Encounters/SOAP/Prescription/RxPatientDetailsSection";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPrescriptionsData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { Prescription } from "@/types/chartsInterface";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PastPrescriptionsDialogProps {
  isDialogOpen: boolean;
  userDetailsId: string;
  onClose: () => void;
}

const PastPrescriptionsDialog = ({
  isDialogOpen,
  userDetailsId,
  onClose,
}: PastPrescriptionsDialogProps) => {
  // Data State
  const [response, setResponse] = useState<Prescription[]>([]);

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Chart State
  const chartId = useSelector((state: RootState) => state.user.chartId);

  const fetchAndSetResponse = useCallback(async () => {
    if (chartId) {
      try {
        setLoading(true);
        const data = await getPrescriptionsData({ chartId });
        if (data) {
          setResponse(data);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    }
  }, [chartId]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle asChild>Add Prescription</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <>
          <div className="flex flex-col gap-4">
            {/* Patient Details Section */}
            <RxPatientDetailsSection userDetailsId={userDetailsId} />
            {/* Search & Add Rx Section */}
            {/* <div className="flex flex-col p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  Search & Add Rx
                </span>
                <Input
                  className="w-1/2rounded-md"
                  placeholder="Search for a drug..."
                />
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>Please search for your drug. If not found,</span>
                <Button
                  variant="ghost"
                  className="text-[#84012A] font-semibold ml-1"
                >
                  Add a custom drug
                </Button>
              </div>
            </div> */}

            {/* Past Rx Section */}
            <div className="flex flex-col p-4">
              <span className="text-lg font-semibold text-gray-700 mb-2">
                Past Rx
              </span>
              <div className="flex flex-col gap-3">
                {response && response?.length > 0 ? (
                  response.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-3 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="font-semibold">
                        {prescription.drug_name}
                      </div>
                      <div>{prescription.directions}</div>
                      <div>
                        Primary Diagnosis: {prescription.primary_diagnosis}
                      </div>
                      <div>
                        Secondary Diagnosis: {prescription.secondary_diagnosis}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No past prescriptions found.
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <SubmitButton label="Save Changes" onClick={onClose} />
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default PastPrescriptionsDialog;

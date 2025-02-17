import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import React, { useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FetchPrescription, UserEncounterData } from "@/types/chartsInterface";
import { getPrescriptionsData } from "@/services/chartsServices";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import RxPatientDetailsSection from "./RxPatientDetailsSection";

const PastRx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<FetchPrescription>();

  useEffect(() => {
    const fetchAndSetResponse = async () => {
      if (patientDetails.chart?.id) {
        setLoading(true);
        try {
          const data = await getPrescriptionsData({
            chartId: patientDetails.chart.id,
          });
          if (data) {
            setResponse(data);
          }
        } catch (e) {
          console.log("Error", e);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAndSetResponse();
  }, [patientDetails.chart?.id]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GhostButton>Past Rx </GhostButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[30rem] min-h-30 p-3">
          <div className="flex flex-col p-2 gap-4">
            {/* Patient Details Section */}
            <RxPatientDetailsSection
              userDetailsId={patientDetails.userDetails.id}
            />
            {/* Search & Add Rx Section */}
            <div className="flex flex-col p-4 shadow-sm">
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
            </div>

            {/* Past Rx Section */}
            <div className="flex flex-col p-4">
              <span className="text-lg font-semibold text-gray-700 mb-2">
                Past Rx
              </span>
              <div className="flex flex-col gap-3">
                {response && response?.prescriptions?.length > 0 ? (
                  response.prescriptions.map((prescription) => (
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
            <SubmitButton label="Save Changes" />
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PastRx;

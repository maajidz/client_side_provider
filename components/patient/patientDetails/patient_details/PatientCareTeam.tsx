import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserCareTeam } from "@/services/userServices";
import { PatientCareTeamInterface } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import React, { useCallback, useEffect, useState } from "react";

const PatientCareTeam = ({ userDetailsId }: { userDetailsId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [careTeam, setCareTeam] = useState<PatientCareTeamInterface>();
  const { toast } = useToast();

  const fetchPatientCareTeam = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchUserCareTeam({ userDetailsId });
      if (response) {
        setCareTeam(response);
      }
    } catch (error) {
      console.log("Error", error);
      showToast({
        toast,
        type: "erroe",
        message: "Error while fetching Care Team",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, userDetailsId]);

  useEffect(() => {
    fetchPatientCareTeam();
  }, [fetchPatientCareTeam]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-row justify-evenly">
      <div className="flex flex-col border p-5 flex-1">
        <div className="flex flex-col ">
          Primary Care Physician{" "}
          <div>{careTeam?.primaryCarePhysician.NameOfPhysician}</div>
        </div>
      </div>
      <div className="flex flex-col border p-5 flex-1">Referring Provider</div>
      <div className="flex flex-col border p-5 flex-1"> In-house Care Team</div>
    </div>
  );
};

export default PatientCareTeam;

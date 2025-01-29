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
    <div className="flex flex-row gap-5">
      <div className="flex flex-col">
        <div className="">
          Primary Care Physician{" "}
          {careTeam?.primaryCarePhysician.NameOfPhysician}
        </div>
      </div>
      <div>Referring Provider</div>
      <div> In-house Care Team</div>
    </div>
  );
};

export default PatientCareTeam;

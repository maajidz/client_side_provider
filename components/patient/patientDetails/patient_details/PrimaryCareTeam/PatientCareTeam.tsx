import { useToast } from "@/hooks/use-toast";
import { fetchUserCareTeam } from "@/services/userServices";
import { PatientCareTeamInterface } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./patient_care_team.module.css";
import PrimaryCarePhysician from "./PrimaryCarePhysician";
import DataListShimmer from "@/components/custom_buttons/shimmer/DataListShimmer";
// import ReferringPhysicianSelect from "./ReferringPhysicianSelect";
// import InHouseCareTeam from "./InHouseCareTeam";

const PatientCareTeam = ({ userDetailsId }: { userDetailsId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [careTeam, setCareTeam] = useState<PatientCareTeamInterface>();
  const [refreshKey, setRefreshKey] = useState(0);
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
        type: "error",
        message: "Error while fetching Care Team",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, userDetailsId]);

  useEffect(() => {
    fetchPatientCareTeam();
  }, [fetchPatientCareTeam, refreshKey]);

  return (
    <div className={styles.infoContainer}>
      {loading ? (
        <DataListShimmer />
      ) : (
        <PrimaryCarePhysician
          careTeam={careTeam ? careTeam : null}
          refreshKey={refreshKey}
          userDetailsId={userDetailsId}
          onRefresh={setRefreshKey}
        />
      )}
      {/* <ReferringPhysicianSelect />
      <InHouseCareTeam /> */}
    </div>
  );
};

export default PatientCareTeam;

import React from "react";
import ViewPatientVitals from "./ViewPatientVitals";
import PageContainer from "@/components/layout/page-container";

const PatientVitals = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer scrollable={true}>
      <ViewPatientVitals userDetailsId={userDetailsId} />
    </PageContainer>
  );
};

export default PatientVitals;

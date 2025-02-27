import React from "react";
import ViewVaccineOrders from "./ViewVaccineOrders";

const PatientVaccineOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  return <ViewVaccineOrders userDetailsId={userDetailsId} />;
};

export default PatientVaccineOrders;

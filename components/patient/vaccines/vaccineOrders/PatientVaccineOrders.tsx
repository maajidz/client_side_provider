import React from "react";
import ViewVaccineOrders from "./ViewVaccineOrders";

const PatientVaccineOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <div className="w-full">
      <ViewVaccineOrders userDetailsId={userDetailsId} />
    </div>
  );
};

export default PatientVaccineOrders;

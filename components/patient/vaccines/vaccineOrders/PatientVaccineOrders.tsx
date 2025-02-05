import React from "react";
import ViewVaccineOrders from "./ViewVaccineOrders";
import VaccineOrders from "@/components/injections/vaccine-orders/VaccineOrders";

const PatientVaccineOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <div className="w-full">
      <div className="flex justify-end">
        <VaccineOrders />
      </div>
      <ViewVaccineOrders userDetailsId={userDetailsId} />
    </div>
  );
};

export default PatientVaccineOrders;

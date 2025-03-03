import React from "react";
import ViewInjectionOrders from "./ViewInjectionOrders";

const PatientInjectionOrders = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  return (
    <div className="w-full flex flex-col">
      <ViewInjectionOrders userDetailsId={userDetailsId} />
    </div>
  );
};

export default PatientInjectionOrders;

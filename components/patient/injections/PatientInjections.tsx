import Injections from "@/components/injections/Injections";
import React from "react";

const PatientInjections = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      {userDetailsId}
      <Injections />
    </>
  );
};

export default PatientInjections;

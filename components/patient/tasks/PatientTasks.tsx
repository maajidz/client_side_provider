"use client";
import React from "react";
import ViewPatientTasks from "./ViewPatientTasks";

const PatientTasks = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <ViewPatientTasks userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientTasks;
// add => ghost plus. blue-600

import Referral from "@/components/referral/Referral";
import React from "react";

const PatientReferrals = ({ userDetailsId }: { userDetailsId: string }) => {
  console.log(userDetailsId)
  return (
    <>
      <Referral  />
    </>
  );
};

export default PatientReferrals;

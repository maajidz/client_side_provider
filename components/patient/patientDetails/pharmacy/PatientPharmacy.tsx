"use client";

import ERxPharmacy from "./erx/ERxPharmacy";

interface PharmacyProps {
  userDetailsId: string;
}

function PatientPharmacy({ userDetailsId }: PharmacyProps) {
  return (
    <div className="flex flex-col">
      <ERxPharmacy userDetailsId={userDetailsId} />
    </div>
  );
}

export default PatientPharmacy;

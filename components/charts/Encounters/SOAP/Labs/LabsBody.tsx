import React from "react";
import AddLabsDialog from "./AddLabsDialog";
import PastOrdersDialog from "./PastOrdersDialog";
import ViewOrdersDialog from "./ViewOrdersDialog";
import SearchAndAddDrawer from "./SearchAndAddDrawer";
import { UserEncounterData } from "@/types/chartsInterface";

const LabsBody = ({
  patientDetails,
  signed,
}: {
  patientDetails: UserEncounterData;
  signed: boolean;
}) => {
  return (
    <div className="flex justify-between border-b pb-3">
      <label className="text-sm font-semibold">Labs</label>
      <div className="flex h-5 items-center space-x-4 text-sm">
        <SearchAndAddDrawer
          userDetailsId={patientDetails.userDetails.userDetailsId}
          signed={signed}
        />
        <AddLabsDialog
          userDetailsId={patientDetails.userDetails.userDetailsId}
          signed={signed}
        />
        <PastOrdersDialog
          userDetailsId={patientDetails.userDetails.userDetailsId}
        />
        <ViewOrdersDialog
          userDetailsId={patientDetails.userDetails.userDetailsId}
        />
      </div>
    </div>
  );
};

export default LabsBody;

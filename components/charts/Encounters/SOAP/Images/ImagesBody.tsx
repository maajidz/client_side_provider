import React from "react";
import AddImagesDrawer from "./AddImagesDrawer";
import PastImageOrders from "./PastImageOrders";
import { UserEncounterData } from "@/types/chartsInterface";
// import MapDx from './MapDx'

const ImagesBody = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  return (
    <div className="flex justify-between border-b pb-3">
      <label className="text-sm font-semibold">Images</label>
      <div className="flex h-5 items-center space-x-4 text-sm">
        <AddImagesDrawer
          userDetailsId={patientDetails.userDetails.userDetailsId}
        />
        <PastImageOrders
          userDetailsId={patientDetails.userDetails.userDetailsId}
        />
        {/* <Separator orientation="vertical" />
                    <MapDx /> */}
      </div>
    </div>
  );
};

export default ImagesBody;

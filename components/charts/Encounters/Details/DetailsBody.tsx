import FormLabels from "@/components/custom_buttons/FormLabels";
import { UserEncounterData } from "@/types/chartsInterface";
import React from "react";
import Alerts from "./Alerts/alerts";
import Allergies from "./Allergies/Allerggies";
import StickyNotes from "./StickyNotes/StickyNotes";
import Medications from "./Medications/Medications";
import Diagnoses from "./Diagnoses/Diagnoses";
import Supplements from "./Supplements/Supplements";
import Vaccines from "./Vaccines/Vaccines";
import PastMedicalHistory from "./PastMedicalHistory/PastMedicalHistory";
import FamilyHistory from "./FamilyHistory/FamilyHistory";
import Tasks from "./Tasks/Tasks";
import Pharmacy from "./Pharmacy/Pharmacy";
import Recalls from "./Recalls/Recalls";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ProceduresSurgeriesAndHospitalization from "./ProceduresSurgeriesAndHospitalization/ProceduresSurgeriesAndHospitalization";
import Injections from "./Injections/Injections";
import { calculateAge } from "@/utils/utils";
import SocialHistory from "./SocialHistory/SocialHistory";

const DetailsBody = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const age = calculateAge(patientDetails.userDetails?.dob);

  return (
    <div className="flex flex-col border w-[30rem] p-3 h-full">
      <div className="flex flex-col border-b py-2">
        <div>
          {patientDetails.firstName} {patientDetails.lastName}
        </div>
        <div>
          {patientDetails.userDetails?.gender}/ {age}
        </div>
        <div className="flex justify-between">
          <FormLabels
            label="ID"
            value={patientDetails?.id?.split("-")[0] + "..."}
          />
          <FormLabels
            label="DOB"
            value={patientDetails.userDetails?.dob?.split("T")[0]}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 border-b py-2">
        <FormLabels
          label="Wt"
          value={`${patientDetails.userDetails?.weight} ${patientDetails.userDetails?.weightType}`}
        />
        <FormLabels
          label="Ht"
          value={`${patientDetails.userDetails?.height} ${patientDetails.userDetails?.heightType}`}
        />
        <FormLabels
          label="BMI"
          value={`${
            patientDetails.bmiRecords?.[0].currentBmi
              ? patientDetails.bmiRecords?.[0].currentBmi
              : "N/A"
          }`}
        />
        <FormLabels label="Vist type" value={patientDetails?.visit_type} />
        <FormLabels label="Mode" value={patientDetails?.mode} />
        <FormLabels label="Phone" value={`Phone`} />
      </div>
      <ScrollArea className="h-96 overflow-y-scroll">
        <div className="h-full ">
          <div>
            <Alerts patientDetails={patientDetails} />
            <StickyNotes patientDetails={patientDetails} />
            <Allergies patientDetails={patientDetails} />
            <Medications patientDetails={patientDetails} />
            <Diagnoses
              patientDetails={patientDetails}
              encounterId={encounterId}
            />
            <Supplements patientDetails={patientDetails} />
            <Vaccines patientDetails={patientDetails} />
            <Injections patientDetails={patientDetails} />
            <PastMedicalHistory patientDetails={patientDetails} />
            <FamilyHistory patientDetails={patientDetails} />
            <SocialHistory patientDetails={patientDetails} />
            <ProceduresSurgeriesAndHospitalization
              patientDetails={patientDetails}
            />
            <Tasks patientDetails={patientDetails} />
            <Recalls patientDetails={patientDetails} />
            <Pharmacy patientDetails={patientDetails} />
            {/* <Payers />  */}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DetailsBody;

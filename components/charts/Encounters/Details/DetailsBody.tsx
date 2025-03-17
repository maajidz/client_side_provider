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
import { formatVisitType } from "@/utils/utils";
import SocialHistory from "./SocialHistory/SocialHistory";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

const DetailsBody = ({
  patientDetails,
  encounterId,
  className,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
  className?: string;
}) => {
  // const age = calculateAge(patientDetails.userDetails?.dob);

  return (
    <div className={`flex flex-col gap-2 p-4 h-full font-medium bg-[#F3EFF0] ${className}`}>
      <div className="flex flex-col gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-row items-center gap-2">
          <Avatar className={`flex h-16 w-16 rounded-full border-2 border-[#FFE7E7]`}>
            <AvatarImage src="" className="border-2 border-[#FFE7E7]" />
            <AvatarFallback className="text-[#84012A] bg-rose-50 p-1">
                <span className="text-lg font-semibold">
                  {patientDetails?.userDetails?.firstName?.charAt(0)}
                  {patientDetails?.userDetails?.lastName?.charAt(0)}
                </span>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-md font-semibold">
              {patientDetails?.userDetails?.firstName} {patientDetails?.userDetails?.lastName}
            </span>
            <span className="text-sm flex flex-row gap-1">
              <FormLabels
                value="Female"
              />
              <FormLabels
                // value={age}
                value="29"
              />
            </span>
            <div className="flex gap-4 justify-between">
              <FormLabels
                label="DOB"
                // value={patientDetails.userDetails?.dob?.split("T")[0]}
                value={"23rd May, 2025"}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          <Badge popoverLabel="Weight">
            <Icon name="weight" size={16}/>
            <FormLabels
              label=""
              value={`${patientDetails.progressTracker?.currentWeight} kg`}
            />
          </Badge>
          <Badge popoverLabel="Height">
             <Icon name="height" size={16} />
            <FormLabels label="" value="N/A" />
            {/* value={`${patientDetails.userDetails?.height} ${patientDetails.userDetails?.heightType}`} /> */}
          </Badge>
          <Badge popoverLabel="BMI">
            <Icon name="digital_wellbeing" size={16} />
            <FormLabels label="" value={`${
              patientDetails.progressTracker?.bmiRecords?.[0]?.currentBmi
                ? patientDetails.progressTracker.bmiRecords[0].currentBmi
                : "N/A"
            }`} />
          </Badge>
          <Badge popoverLabel="Visit Type">
            <Icon name="meeting_room" size={16} />
            <FormLabels label="" value={formatVisitType(patientDetails?.visit_type ?? '')} />
          </Badge>
          <Badge popoverLabel="Mode">
            <Icon name="switches" size={16} />
            <FormLabels label="" value={formatVisitType(patientDetails?.mode ?? '')} />
          </Badge>
          {/* <FormLabels label="Phone" value={`Phone`} /> */}
          <Badge popoverLabel="Phone">
            <Icon name="phone" size={16} />
            <FormLabels label="" value={"563487559"} />
          </Badge>
        </div>
      </div>
      <ScrollArea className="overflow-y-scroll">
        <div className="h-[calc(100vh-10rem)] flex flex-col [&>div]:bg-white [&>div]:rounded-xl [&>div]:shadow-sm gap-2">
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default DetailsBody;

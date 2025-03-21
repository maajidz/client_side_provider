import React, { useEffect, useState } from "react";
import ChartNotesAccordion from "./ChartNotesAccordion";
import DxCodeBody from "./Dx/DxCodeBody";
import PrescriptionBody from "./Prescription/PrescriptionBody";
import LabsBody from "./Labs/LabsBody";
import ImagesBody from "./Images/ImagesBody";
import FolllowUp from "./Follow-Up/FolllowUp";
import ReferralBody from "./Referral/ReferralBody";
import {
  PatientPhysicalStats,
  UserEncounterData,
} from "@/types/chartsInterface";

const ChartNotesTabBody = ({
  encounterId,
  patientDetails,
  signed,
  setSubjectiveContent,
  setObjectiveContent,
  setPhysicalStatsContent,
}: {
  encounterId: string;
  patientDetails: UserEncounterData;
  signed: boolean;
  setSubjectiveContent: (text: string) => void;
  setObjectiveContent: (text: string) => void;
  setPhysicalStatsContent: (stats: PatientPhysicalStats) => void;
}) => {
  const [subjective, setSubjective] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [physicalStats, setPhysicalStats] = useState<PatientPhysicalStats>({
    height: 0,
    weight: 0,
  });

  useEffect(() => {
    if (subjective) setSubjectiveContent(subjective);
    if (objective) setObjectiveContent(objective);
    if (physicalStats) setPhysicalStatsContent(physicalStats);
  }, [
    subjective,
    objective,
    physicalStats,
    setObjectiveContent,
    setPhysicalStatsContent,
    setSubjectiveContent,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <ChartNotesAccordion
        subjective={
          patientDetails.chart?.subjective
            ? patientDetails.chart.subjective
            : ""
        }
        signed={signed}
        patientDetails={patientDetails}
        setSubjective={setSubjective}
        setObjective={setObjective}
        setPhysicalStats={setPhysicalStats}
      />
      <DxCodeBody
        patientDetails={patientDetails}
        encounterId={encounterId}
        signed={signed}
      />
      <PrescriptionBody
        patientDetails={patientDetails}
        encounterId={encounterId}
        signed={signed}
      />
      <LabsBody patientDetails={patientDetails} signed={signed} />
      <ImagesBody patientDetails={patientDetails} signed={signed} />
      <FolllowUp patientDetails={patientDetails} encounterId={encounterId} signed={signed}/>
      <ReferralBody patientDetails={patientDetails} encounterId={encounterId} signed= {signed}/>
    </div>
  );
};

export default ChartNotesTabBody;

import React from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PatientDemographics from "./patient_details/PatientDemographics";
import PatientCareTeam from "./patient_details/PatientCareTeam";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import PatientQuestionnaires from "./patient_details/PatientQuestionnaires";
import PatientInsurance from "./patient_details/PatientInsurance";
import PatientPharmacy from "./pharmacy/PatientPharmacy";
import MedicalHistory from "./medical-history/MedicalHistory";

const patientDetailsTab = [
  {
    value: "demographics",
    label: "Demographics",
    component: PatientDemographics,
  },
  { value: "care_team", label: "Care Team", component: PatientCareTeam },
  { value: "medical_history", label: "Medical History", component: MedicalHistory },
  {
    value: "questionnaires",
    label: "Questionnaires",
    component: PatientQuestionnaires,
  },
  { value: "insurance", label: "Insurance", component: PatientInsurance },
  { value: "pharmacy", label: "Pharmacy", component: PatientPharmacy },
];

const PatientDetails = ({ userId }: { userId: string }) => {
  return (
    <Tabs defaultValue="demographics" className="">
      <TabsList className="flex gap-3 w-full">
        {patientDetailsTab.map((tab) => (
          <CustomTabsTrigger value={tab.value} key={tab.value}>
            {tab.label}
          </CustomTabsTrigger>
        ))}
      </TabsList>
      {patientDetailsTab.map(({ value, component: Component }) => (
        <TabsContent value={value} key={value}>
          {Component ? <Component userDetailsId={userId} /> : value}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PatientDetails;

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PatientDemographics from "./patient_details/PatientDemographics/PatientDemographics";
import PatientCareTeam from "./patient_details/PrimaryCareTeam/PatientCareTeam";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import InsuranceInformation from "./patient_details/insurance/InsuranceInformation";
import PatientQuestionnaires from "./patient_details/Patient_Questionnaire/PatientQuestionnaires";
import MedicalHistory from "@/components/patient/patientDetails/patient_details/medical-history/MedicalHistory";
import PatientPharmacy from "./patient_details/pharmacy/PatientPharmacy";
import React from "react";

const patientDetailsTab = [
  {
    value: "demographics",
    label: "Demographics",
    component: PatientDemographics,
  },
  { value: "care_team", label: "Care Team", component: PatientCareTeam },
  {
    value: "medical_history",
    label: "Medical History",
    component: MedicalHistory,
  },
  {
    value: "questionnaires",
    label: "Questionnaires",
    component: PatientQuestionnaires,
  },
  { value: "insurance", label: "Insurance", component: InsuranceInformation },
  { value: "pharmacy", label: "Pharmacy", component: PatientPharmacy },
];

const PatientDetails = ({ userId }: { userId: string }) => {
  return (
    <Tabs defaultValue="demographics" className="gap-4">
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

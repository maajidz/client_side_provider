import React from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PatientDemographics from "./PatientDemographics";
import PatientCareTeam from "./PatientCareTeam";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const patientDetailsTab = [
  {
    value: "demographics",
    label: "Demographics",
  },
  {
    value: "care_team",
    label: "Care Team",
  },
  {
    value: "medical_history",
    label: "Medical History",
  },
  {
    value: "questionnaires",
    label: "Questionnaires",
  },
  {
    value: "insurance",
    label: "Insurance",
  },
  {
    value: "pharmacy",
    label: "Pharmacy",
  },
];

const PatientDetails = ({ userId }: { userId: string }) => {
  return (
    <Tabs defaultValue="demographics" className="">
      <TabsList className="flex gap-3 w-full">
        {patientDetailsTab.map((tab) => (
          <CustomTabsTrigger
            value={tab.value}
            key={tab.value}
          >
            {tab.label}
          </CustomTabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="demographics">
        <PatientDemographics userId={userId} />
      </TabsContent>
      <TabsContent value="care_team">
        <PatientCareTeam userDetailsId={userId} />
      </TabsContent>
      <TabsContent value="medical_history">Medical History</TabsContent>
      <TabsContent value="questionnaires">Questionnaires</TabsContent>
      <TabsContent value="insurance">Insurance</TabsContent>
      <TabsContent value="pharmacy">Pharmacy</TabsContent>
    </Tabs>
  );
};

export default PatientDetails;

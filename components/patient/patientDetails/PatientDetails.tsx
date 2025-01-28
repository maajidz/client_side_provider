import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientDemographics from "./PatientDemographics";

const PatientDetails = ({ userId }: { userId: string }) => {
  return (
    <Tabs defaultValue="demographics" className="">
      <TabsList className="flex gap-3 w-full">
        <TabsTrigger className="w-full" value="demographics">Demographics</TabsTrigger>
        <TabsTrigger className="w-full" value="care_team">Care Team</TabsTrigger>
        <TabsTrigger className="w-full" value="medical_history">Medical History</TabsTrigger>
        <TabsTrigger className="w-full" value="questionnaires">Questionnaires</TabsTrigger>
        <TabsTrigger className="w-full" value="insurance">Insurance</TabsTrigger>
        <TabsTrigger className="w-full" value="pharmacy">Pharmacy</TabsTrigger>
      </TabsList>
      <TabsContent value="demographics">
        <PatientDemographics userId={userId} />
      </TabsContent>
      <TabsContent value="care_team">Change your password here.</TabsContent>
      <TabsContent value="medical_history">Medical History</TabsContent>
      <TabsContent value="questionnaires">Questionnaires</TabsContent>
      <TabsContent value="insurance">Insurance</TabsContent>
      <TabsContent value="pharmacy">Pharmacy</TabsContent>
    </Tabs>
  );
};

export default PatientDetails;

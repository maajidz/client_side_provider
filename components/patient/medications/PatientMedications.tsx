import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import PatientSupplements from "./PatientSupplements/PatientSupplements";
import PatientMedication from "./PatientMedications/PatientMedication";

const PatientMedications = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <Tabs defaultValue="medications" className="">
        <TabsList className="w-full">
          <TabsTrigger value="medications" className="w-full">Medications</TabsTrigger>
          <TabsTrigger value="supplements" className="w-full">Supplements</TabsTrigger>
        </TabsList>
        <TabsContent value="medications">
          <PatientMedication  userDetailsId={userDetailsId} />
        </TabsContent>
        <TabsContent value="supplements">
          <PatientSupplements userDetailsId={userDetailsId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PatientMedications;

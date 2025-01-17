import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
import ViewPatientDocuments from "./ViewPatientDocuments";
import { Separator } from "@/components/ui/separator";

const PatientDocuments = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <Tabs defaultValue="all" className="">
        <TabsList className="flex flex-col gap-2 h-full">
          <TabsTrigger value="lastvisit">Since Last visit</TabsTrigger>
          <TabsTrigger value="unsigned">Unsigned</TabsTrigger>
          <TabsTrigger value="6months">Past 6 Months</TabsTrigger>
          <TabsTrigger value="1year">Past 1 year</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <Separator className="bg-black w-full text-black border border-black" />
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="patient">Shared by patient</TabsTrigger>
        </TabsList>
        <TabsContent value="lastvisit">Since Last visit</TabsContent>
        <TabsContent value="unsigned">Unsigned</TabsContent>
        <TabsContent value="6months">Past 6 Months</TabsContent>
        <TabsContent value="1year">Past 1 year</TabsContent>
        <TabsContent value="all">
          <div className="w-full">
            <ViewPatientDocuments userDetailsId={userDetailsId} />
          </div>
        </TabsContent>
        <TabsContent value="images">Images</TabsContent>
        <TabsContent value="patient">Shared by patient</TabsContent>
      </Tabs>
    </>
  );
};

export default PatientDocuments;

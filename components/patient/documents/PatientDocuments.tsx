import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
import ViewPatientDocuments from "./ViewPatientDocuments";
import { Separator } from "@/components/ui/separator";
import UploadDocumentDialog from "./UploadDocumentDialog";
import PageContainer from "@/components/layout/page-container";

const PatientDocuments = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-3 rounded-lg">
        <div className="flex justify-end">
          <UploadDocumentDialog userDetailsId={userDetailsId} /> 
        </div>

        <Tabs defaultValue="all" className="flex gap-4">
          <TabsList className="flex flex-col gap-4 h-full p-2 rounded-lg border">
            <TabsTrigger value="lastvisit" className="hover:bg-white">
              Since Last Visit
            </TabsTrigger>
            <TabsTrigger value="unsigned" className="hover:bg-white">
              Unsigned
            </TabsTrigger>
            <TabsTrigger value="6months" className="hover:bg-white">
              Past 6 Months
            </TabsTrigger>
            <TabsTrigger value="1year" className="hover:bg-white">
              Past 1 Year
            </TabsTrigger>
            <TabsTrigger value="all" className=" hover:bg-white">
              All
            </TabsTrigger>
            <Separator className="bg-black w-full text-black border border-black" />
            <TabsTrigger value="images" className="hover:bg-white">
              Images
            </TabsTrigger>
            <TabsTrigger value="patient" className="hover:bg-white">
              Shared by Patient
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-4 rounded-lg border border-gray-300">
            <TabsContent value="lastvisit">
              <p>Content for Since Last Visit</p>
            </TabsContent>
            <TabsContent value="unsigned">
              <p>Content for Unsigned</p>
            </TabsContent>
            <TabsContent value="6months">
              <p>Content for Past 6 Months</p>
            </TabsContent>
            <TabsContent value="1year">
              <p>Content for Past 1 Year</p>
            </TabsContent>
            <TabsContent value="all">
              <ViewPatientDocuments userDetailsId={userDetailsId} />
            </TabsContent>
            <TabsContent value="images">
              <p>Content for Images</p>
            </TabsContent>
            <TabsContent value="patient">
              <p>Content for Shared by Patient</p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientDocuments;

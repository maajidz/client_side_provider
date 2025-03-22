import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartNotes from "./ChartNotes";
// import FlowSheet from './FlowSheet';
// import TreatmentPlan from './TreatmentPlan';
import LabsPreview from "./LabsPreview";
import ImagesPreview from "./ImagesPreview";
import DocumentPreview from "./Documents/DocumentPreview";
// import QuestionnairePreview from './QuestionnairePreview';
import { UserEncounterData } from "@/types/chartsInterface";
import { Icon } from "@/components/ui/icon";

const PreviewBody = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  return (
    <div className="flex flex-1 py-4 h-full font-medium">
      <Tabs defaultValue="chartNotes" className="w-full gap-2">
        <TabsList className="flex [&>*]:pl-2 [&>*]:pr-3 gap-2 w-fit [&>button]:data-[state=active]:hover:bg-white">
          <TabsTrigger value="chartNotes" className="data-[state=active]:text-rose-900 data-[state=active]:hover:text-rose-900">
            <Icon name="description" />
            CN
          </TabsTrigger>
          {/* <TabsTrigger value="flowsheet"><Target /></TabsTrigger>
                    <TabsTrigger value="treatmentPlan"><Target /></TabsTrigger> */}
          <TabsTrigger value="labs" className="data-[state=active]:text-rose-900 data-[state=active]:hover:text-rose-900">
            <Icon name="experiment" />
            Labs
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:text-rose-900 data-[state=active]:hover:text-rose-900">
            <Icon name="radiology" />
            Images
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:text-rose-900 data-[state=active]:hover:text-rose-900">
            <Icon name="picture_as_pdf" />
            Docs
          </TabsTrigger>
          {/* <TabsTrigger value="questionnaires"><FileQuestion /></TabsTrigger> */}
        </TabsList>
        <TabsContent value="chartNotes" className="md:px-0 p-0">
          <ChartNotes patientDetails={patientDetails} />
        </TabsContent>
        {/* <TabsContent value="flowsheet">
                    <FlowSheet />
                </TabsContent>
                <TabsContent value="treatmentPlan">
                    <TreatmentPlan />
                </TabsContent> */}
        <TabsContent value="labs">
          <LabsPreview userDetailsId={patientDetails.userDetails.userDetailsId} />
        </TabsContent>
        <TabsContent value="images">
          <ImagesPreview userDetailsId={patientDetails.userDetails.userDetailsId} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentPreview patientDetails={patientDetails} />
        </TabsContent>
        {/* <TabsContent value="questionnaires">
                    <QuestionnairePreview />
                </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default PreviewBody;

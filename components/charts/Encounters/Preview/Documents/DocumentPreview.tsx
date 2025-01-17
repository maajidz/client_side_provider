import PageContainer from "@/components/layout/page-container";
import React from "react";
import Documents from "./Documents";
import { UserEncounterData } from "@/types/chartsInterface";

const DocumentPreview = ({patientDetails}: {patientDetails: UserEncounterData}) => {

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-5 w-full">
        Documents
        <Documents patientDetails={patientDetails} />
      </div>
    </PageContainer>
  );
};

export default DocumentPreview;

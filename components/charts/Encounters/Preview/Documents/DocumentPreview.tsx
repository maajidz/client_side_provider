import PageContainer from "@/components/layout/page-container";
import React from "react";
import Documents from "./Documents";

const DocumentPreview = () => {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-5">
        Documents
        <Documents />
      </div>
    </PageContainer>
  );
};

export default DocumentPreview;

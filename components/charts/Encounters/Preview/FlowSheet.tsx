import PageContainer from "@/components/layout/page-container";
import React from "react";

const FlowSheet = () => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        Flow Sheet
        <div className="flex flex-col gap-3 border-b">
          No flowsheets available in your account. Create Now
        </div>
      </div>
    </PageContainer>
  );
};

export default FlowSheet;

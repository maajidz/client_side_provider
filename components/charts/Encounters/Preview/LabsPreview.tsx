import LabResults from "@/components/lab/LabResults/LabResults";
import PageContainer from "@/components/layout/page-container";
import React from "react";

const LabsPreview = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6 p-4 [&>div>div>form]:!grid-cols-2 [&>div>div>div>div]:!flex-col [&>div>div>div>div]:!gap-2 [&>div>div>div>div]:!items-start  [&_input]:!w-full">
        <div className="flex flex-col gap-3">
          <LabResults userDetailsId={userDetailsId} />
        </div>
      </div>
    </PageContainer>
  );
};

export default LabsPreview;

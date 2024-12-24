import PageContainer from "@/components/layout/page-container";
import React from "react";
import QuestionnairePreviewDialog from "./PreviewDialogs/QuestionnairePreviewDialog";

const QuestionnairePreview = () => {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold text-gray-800">Questionnaires</h3>
        <hr className="border-t border-gray-300 mb-4" />
        <div className="flex justify-center items-center grow text-center text-gray-600">
          <p>No questionnaire is associated with this encounter.</p>
          <QuestionnairePreviewDialog />
        </div>
      </div>
    </PageContainer>
  );
};

export default QuestionnairePreview;

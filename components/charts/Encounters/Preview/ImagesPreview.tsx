import ImageResults from "@/components/images/ImageResults/ImageResults";
import PageContainer from "@/components/layout/page-container";

const ImagesPreview = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        Image Results
        <div className="flex flex-col gap-3 border-b">
          <ImageResults userDetailsId={userDetailsId} />
        </div>
      </div>
    </PageContainer>
  );
};

export default ImagesPreview;

import ImageResults from "@/components/images/ImageResults/ImageResults";
import PageContainer from "@/components/layout/page-container";

const ImagesPreview = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-5 w-full p-4">
        <ImageResults userDetailsId={userDetailsId} />
      </div>
    </PageContainer>
  );
};

export default ImagesPreview;
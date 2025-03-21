import ImageResults from "@/components/images/ImageResults/ImageResults";
import PageContainer from "@/components/layout/page-container";

const ImagesPreview = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer className="">
      <div className="flex flex-col gap-4 p-4 overflow-x-scroll">
        <ImageResults userDetailsId={userDetailsId} />
      </div>
    </PageContainer>
  );
};

export default ImagesPreview;

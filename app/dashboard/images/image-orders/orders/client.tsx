import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { getImagesOrdersData } from "@/services/chartsServices";
import {
  ImageOrdersInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";

interface ImageOrdersClientProps {
  patientDetails: UserEncounterData | undefined;
}

function ImageOrdersClient({ patientDetails }: ImageOrdersClientProps) {
  // Loading State
  const [loading, setLoading] = useState(false);
  // Image Orders Data State
  const [imageOrdersData, setImagesOrdersData] = useState<
    ImageOrdersInterface[]
  >([]);
  // Number of Pages State
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { toast } = useToast();

  const fetchImageOrders = useCallback(
    async ({
      userDetailsId,
      providerId,
      pageNo,
    }: {
      userDetailsId?: string;
      providerId?: string;
      pageNo: number;
    }) => {
      setLoading(true);

      try {
        const response = await getImagesOrdersData({
          userDetailsId,
          providerId,
          limit: 10,
          page: pageNo,
        });

        setImagesOrdersData(response);
        setTotalPages(response.length);
      } catch (e) {
        if (e instanceof Error) {
          showToast({
            toast,
            type: "error",
            message: "Could not fetch image orders",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchImageOrders({
      userDetailsId: patientDetails?.userDetails.id,
      providerId: patientDetails?.providerID,
      pageNo: pageNo,
    });
  }, [
    pageNo,
    fetchImageOrders,
    patientDetails?.userDetails,
    patientDetails?.providerID,
  ]);

  return (
    <>
      <div className="flex items-start space-y-4 mb-4">
        <Heading
          title="Image Orders"
          description="A list of image orders of the patients' reports"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <LoadingButton />
        </div>
      ) : (
        <DataTable
          searchKey="imageOrders"
          columns={columns()}
          data={imageOrdersData}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}
    </>
  );
}

export default ImageOrdersClient;


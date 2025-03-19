import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/hooks/use-toast";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { getUserPrescriptionsData } from "@/services/prescriptionsServices";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import FilterPrescriptions from "./FilterPrescriptions";
import { useCallback, useEffect, useState } from "react";

function PrescriptionsClient() {
  // Prescription Data State
  const [prescriptionData, setPrescription] = useState<
    PrescriptionDataInterface[]
  >([]);

  // Selected IDs
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null
  );

  // Loading State
  const [dataLoading, setDataLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Pagination States
  const limit = 6;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // GET Prescriptions Data
  const fetchPrescriptionsData = useCallback(async () => {
    if (!selectedUserId) return;

    setDataLoading(true);

    try {
      const response = await getUserPrescriptionsData({
        limit,
        page,
        userDetailsId: selectedUserId,
        providerId: selectedProviderId ?? "",
      });

      if (response) {
        setPrescription(response.data);
        setTotalPages(Math.ceil(response.totalCount / limit));
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch prescriptions data for selected patient",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setDataLoading(false);
    }
  }, [page, selectedUserId, selectedProviderId, toast]);

  // Effects
  useEffect(() => {
    fetchPrescriptionsData();
  }, [fetchPrescriptionsData]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FilterPrescriptions
          onSelectUser={setSelectedUserId}
          onSelectProvider={setSelectedProviderId}
        />
      </div>
      {dataLoading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={
            <Heading
              title="Prescriptions"
              description="A list of prescriptions assigned to the patients"
            />
          }
          columns={columns()}
          data={prescriptionData}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default PrescriptionsClient;

"use client";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchUserMedicationData } from "@/services/medicationServices";
import { UserMedicationInterface } from "@/types/medicationInterface";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

export const PatientMedicationsClient = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [userMedications, setUserMedications] =
    useState<UserMedicationInterface>();
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchAndSetResponse = async () => {
      try {
        const fetchedMedications = await fetchUserMedicationData({
          userDetailsId: userDetailsId,
        });
        console.log("Fetched Medications:", fetchedMedications);
        if (fetchedMedications) {
          setUserMedications(fetchedMedications);
          setTotalPages(fetchedMedications.total);
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetResponse();
  }, [userDetailsId]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Patient Medications (${userMedications?.total})`}
          description=""
        />
      </div>
      <Separator />
      {loading ? (
        <TableShimmer />
      ) : userMedications?.data && userMedications?.data.length > 0 ? (
        <DefaultDataTable
          columns={columns()}
          data={userMedications?.data}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      ) : (
        <div className="flex flex-col justify-center items-center justify-items-center pt-20">
          User hasn&apos;t placed any medication order.
        </div>
      )}
    </>
  );
};

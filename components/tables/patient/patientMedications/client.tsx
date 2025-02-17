"use client";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { fetchUserMedicationData } from "@/services/medicationServices";
import { UserMedicationInterface } from "@/types/medicationInterface";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Patient Medications (${userMedications?.total})`}
          description=""
        />
      </div>
      <Separator />
      {userMedications?.data && userMedications?.data.length > 0 ? (
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

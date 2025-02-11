import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { getAllergiesData } from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { AllergenResponseInterfae } from "@/types/allergyInterface";
import EditAllergy from "@/components/charts/Encounters/Details/Allergies/EditAllergy";

const ViewPatientAllergies = ({ userDetailsId }: { userDetailsId: string }) => {
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AllergenResponseInterfae[]>([]);
  const [editData, setEditData] = useState<AllergenResponseInterfae>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchAllergies = useCallback(
    async (page: number) => {
      // setLoading(true);
      try {
        const response = await getAllergiesData({
          limit: limit,
          page: page,
          userDetailsId: userDetailsId,
        });
        if (response) {
          setData(response);
          setTotalPages(response.length / limit);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [userDetailsId]
  );

  useEffect(() => {
    fetchAllergies(page);
  }, [fetchAllergies, page]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="py-5">
        {data && (
          <DataTable
            searchKey="id"
            columns={columns({
              setEditData,
              setIsDialogOpen,
              setLoading,
              showToast: () =>
                showToast({
                  toast,
                  type: "success",
                  message: "Deleted Successfully",
                }),
              fetchAllergies: () => fetchAllergies(page),
            })}
            data={data}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
        <EditAllergy
          selectedAllergy={editData}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
          fetchAllergies={() => fetchAllergies(page)}
        />
    </>
  );
};

export default ViewPatientAllergies;

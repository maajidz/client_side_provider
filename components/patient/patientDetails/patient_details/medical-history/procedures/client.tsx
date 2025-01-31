"use client";

import LoadingButton from "@/components/LoadingButton";
import { getProcedureData } from "@/services/chartDetailsServices";
import { ProceduresInterface } from "@/types/procedureInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import { CustomDataTable } from "@/components/custom_buttons/table/CustomDataTable";

interface ProceduresSurgeriesAndHospitalizationClientProps {
  userDetailsId: string;
}

function ProceduresSurgeriesAndHospitalizationClient({
  userDetailsId,
}: ProceduresSurgeriesAndHospitalizationClientProps) {
  // Procedures Data
  const [data, setData] = useState<ProceduresInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getProcedureData({
        userDetailsId,
      });

      if (response) {
        setData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  if (loading) return <LoadingButton />;

  return (
    <>
      <CustomDataTable
        columns={columns()}
        data={data}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>
  );
}

export default ProceduresSurgeriesAndHospitalizationClient;

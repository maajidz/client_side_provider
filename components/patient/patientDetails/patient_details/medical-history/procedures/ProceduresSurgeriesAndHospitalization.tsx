"use client";


import ProceduresSurgeriesAndHospitalizationDialog from "@/components/charts/Encounters/Details/ProceduresSurgeriesAndHospitalization/ProceduresSurgeriesAndHospitalizationDialog";

import { getProcedureData } from "@/services/chartDetailsServices";
import { ProceduresInterface } from "@/types/procedureInterface";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { columns } from "./column";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";


interface ProceduresSurgeriesAndHospitalizationProps {
  userDetailsId: string;
}

function ProceduresSurgeriesAndHospitalization({
  userDetailsId,
}: ProceduresSurgeriesAndHospitalizationProps) {
  // Procedures Data
  const [data, setData] = useState<ProceduresInterface[]>([]);

  // Loading State
  const [, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // GET Procedures data
  const fetchProcedures = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getProcedureData({
        userDetailsId,
        page,
        limit: itemsPerPage,
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
  }, [userDetailsId, page]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 text-lg font-semibold flex-col">
        <div className="flex flex-row items-center gap-4">
          <span>Procedures, Surgeries and Hospitalization</span>
          <Button variant="ghost" onClick={() => setIsOpen(true)}> Add </Button>
          <ProceduresSurgeriesAndHospitalizationDialog
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              fetchProcedures();
            }}
            userDetailsId={userDetailsId}
          />
        </div>
      <DefaultDataTable
        columns={columns()}
        data={data || []}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
    </div>
  );
}

export default ProceduresSurgeriesAndHospitalization;
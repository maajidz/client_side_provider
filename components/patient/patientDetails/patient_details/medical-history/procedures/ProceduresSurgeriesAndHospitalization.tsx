"use client";

import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import ProceduresSurgeriesAndHospitalizationDialog from "@/components/charts/Encounters/Details/ProceduresSurgeriesAndHospitalization/ProceduresSurgeriesAndHospitalizationDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProcedureData } from "@/services/chartDetailsServices";
import { ProceduresInterface } from "@/types/procedureInterface";
import ProceduresSurgeriesAndHospitalizationClient from "./client";
import { useCallback, useEffect, useState } from "react";

interface ProceduresSurgeriesAndHospitalizationProps {
  userDetailsId: string;
}

function ProceduresSurgeriesAndHospitalization({
  userDetailsId,
}: ProceduresSurgeriesAndHospitalizationProps) {
  // Procedures Data
  const [data, setData] = useState<ProceduresInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

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
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Procedures, Surgeries and Hospitalization</span>
        <GhostButton onClick={() => setIsOpen(true)}> Add </GhostButton>
        <ProceduresSurgeriesAndHospitalizationDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            fetchProcedures();
          }}
          userDetailsId={userDetailsId}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <ProceduresSurgeriesAndHospitalizationClient
          data={data}
          loading={loading}
          pageNo={page}
          totalPages={totalPages}
          onSetPageNo={setPage}
        />
      </ScrollArea>
    </div>
  );
}

export default ProceduresSurgeriesAndHospitalization;

"use client";

import LoadingButton from "@/components/LoadingButton";
import { ProcedureData } from "@/types/procedureInterface";
import { columns } from "./column";
import { Dispatch, SetStateAction } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

interface ProceduresSurgeriesAndHospitalizationClientProps {
  data: ProcedureData[];
  loading: boolean;
  pageNo: number;
  totalPages: number;
  onSetPageNo: Dispatch<SetStateAction<number>>;
}

function ProceduresSurgeriesAndHospitalizationClient({
  data,
  loading,
  pageNo,
  totalPages,
  onSetPageNo,
}: ProceduresSurgeriesAndHospitalizationClientProps) {
  if (loading) return <LoadingButton />;

  return (
    <DefaultDataTable
      columns={columns()}
      data={data || []}
      pageNo={pageNo}
      totalPages={totalPages}
      onPageChange={(newPage) => onSetPageNo(newPage)}
    />
  );
}

export default ProceduresSurgeriesAndHospitalizationClient;

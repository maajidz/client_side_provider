"use client";

import { CustomDataTable } from "@/components/custom_buttons/table/CustomDataTable";
import LoadingButton from "@/components/LoadingButton";
import { ProceduresInterface } from "@/types/procedureInterface";
import { columns } from "./column";
import { Dispatch, SetStateAction } from "react";

interface ProceduresSurgeriesAndHospitalizationClientProps {
  data: ProceduresInterface[];
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
    <CustomDataTable
      columns={columns()}
      data={data || []}
      pageNo={pageNo}
      totalPages={totalPages}
      onPageChange={(newPage) => onSetPageNo(newPage)}
    />
  );
}

export default ProceduresSurgeriesAndHospitalizationClient;

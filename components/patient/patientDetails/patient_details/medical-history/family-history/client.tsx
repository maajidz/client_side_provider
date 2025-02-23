import LoadingButton from "@/components/LoadingButton";
import { FamilyHistoryResponseInterface } from "@/types/familyHistoryInterface";
import { columns } from "./column";
import { Dispatch, SetStateAction } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

interface FamilyHistoryClientProps {
  data: FamilyHistoryResponseInterface[];
  loading: boolean;
  pageNo: number;
  totalPages: number;
  onSetPageNo: Dispatch<SetStateAction<number>>;
}

function FamilyHistoryClient({
  data,
  loading,
  pageNo,
  totalPages,
  onSetPageNo,
}: FamilyHistoryClientProps) {
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

export default FamilyHistoryClient;

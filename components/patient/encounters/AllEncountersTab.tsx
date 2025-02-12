import React from "react";
import { columns } from "@/components/tables/charts/columns";
import { useRouter } from "next/navigation";
import { EncounterInterface } from "@/types/encounterInterface";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

const AllEncountersTab = ({
  chartList,
  page,
  totalPages,
  setPage,
}: {
  chartList: EncounterInterface;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) => {
  const router = useRouter();
  const handleRowClick = (id: string) => {
    router.push(`/encounter/${id}`);
  };
  return (
    <div className="w-full">
      {chartList?.response && (
        <DefaultDataTable
          columns={columns(handleRowClick)}
          data={chartList.response}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default AllEncountersTab;

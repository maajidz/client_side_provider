import React, { useState } from "react";
import { columns } from "@/components/tables/charts/columns";
import { useRouter } from "next/navigation";
import { EncounterInterface } from "@/types/encounterInterface";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import CreateEncounterDialog from "@/components/charts/CreateEncounterDialog";

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

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      {chartList?.response && (
        <DefaultDataTable
          title={"All Encounters"}
          onAddClick={() => {
            setIsDialogOpen(true);
          }}
          columns={columns(handleRowClick)}
          data={chartList.response}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
      <CreateEncounterDialog
        isDialogOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AllEncountersTab;

import React, { useState } from "react";
import { columns } from "@/components/tables/charts/columns";
import { EncounterInterface } from "@/types/encounterInterface";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import CreatePatientEncounterDialog from "./CreatePatientEncounterDialog";

const AllEncountersTab = ({
  chartList,
  page,
  totalPages,
  setPage,
  userDetailsId,
}: {
  chartList: EncounterInterface;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  userDetailsId: string;
}) => {
  const handleRowClick = (id: string) => {
    window.open(`/encounter/${id}`);
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
      <CreatePatientEncounterDialog
        isDialogOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        userDetailsId={userDetailsId}
      />
    </div>
  );
};

export default AllEncountersTab;

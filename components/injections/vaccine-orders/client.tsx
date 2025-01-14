import { DataTable } from "@/components/ui/data-table";
import { columns } from "./column";
import FilterVaccines from "./FilterVaccines";

function VaccinesClient() {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterVaccines />
      </div>
      <DataTable
        searchKey="Injections"
        columns={columns()}
        data={[]}
        pageNo={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}

export default VaccinesClient;

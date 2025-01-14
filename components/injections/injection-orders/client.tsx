import { DataTable } from "@/components/ui/data-table";
import { columns } from "./column";
import FilterInjections from "./FilterInjections";

function InjectionsClient() {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterInjections />
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

export default InjectionsClient;

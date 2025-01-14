import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FilterInjections() {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* Ordered By Filter */}
      <Select>
        <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by Ordered by" />
        </SelectTrigger>
        <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select>
        <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      {/* Patient Filter */}
      <Select>
        <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by Patient" />
        </SelectTrigger>
        <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterInjections;


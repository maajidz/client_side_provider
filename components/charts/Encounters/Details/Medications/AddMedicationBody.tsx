"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMedicationData } from "@/services/chartDetailsServices";
import { MedicationResultInterface } from "@/types/medicationInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import MedicationDetailsDialog from "./MedicationDetailsDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

interface AddMedicationBodyProps {
  userDetailsId: string;
}

const AddMedicationBody = ({ userDetailsId }: AddMedicationBodyProps) => {
  // Medication Data States
  const [medicationData, setMedicationData] = useState<
    MedicationResultInterface[]
  >([]);
  const [filteredData, setFilteredData] = useState<MedicationResultInterface[]>(
    []
  );

  // Add Medication Dialog States
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<
    MedicationResultInterface | undefined
  >(undefined);

  // Pages States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Filter States
  const [filters, setFilters] = useState({
    strength: "all",
    route: "all",
    doseForm: "all",
  });

  // Loading States
  const [isLoading, setIsLoading] = useState({ get: false, post: false });

  // Get Medication Data
  const fetchMedicationData = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, get: true }));

    try {
      const response = await getMedicationData({
        page: currentPage,
        limit: limit,
      });
      setMedicationData(response.result);
      setFilteredData(response.result);

      setTotalPages(Math.ceil(response.total / limit));
    } catch (err) {
      console.error("Error fetching pharmacy data:", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, get: false }));
    }
  }, [currentPage, limit]);

  // Apply Filters
  const applyFilters = useCallback(() => {
    const filtered = medicationData.filter((medication) => {
      return (
        (filters.strength === "all" ||
          medication?.strength === filters.strength) &&
        (filters.route === "all" || medication?.route === filters.route) &&
        (filters.doseForm === "all" ||
          medication?.doseForm === filters.doseForm)
      );
    });
    setFilteredData(filtered);
  }, [medicationData, filters]);

  // Effects
  useEffect(() => {
    fetchMedicationData();
  }, [fetchMedicationData]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const getUniqueValues = <T,>(data: T[], accessor: (item: T) => string) => {
    return Array.from(new Set(data.map(accessor))).filter(Boolean);
  };

  // Filter Handlers
  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  // Handle Selected Medication
  const handleSelectedMedication = (row: MedicationResultInterface) => {
    setIsDetailsDialogOpen(true);
    setSelectedMedication(row);
  };

  return (
    <div className="flex flex-col space-y-3 py-5">
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={(value) => handleFilterChange("strength", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Strength" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {getUniqueValues(filteredData, (item) => item.strength).map(
              (strength) => (
                <SelectItem key={strength} value={strength}>
                  {strength}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("route", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Route" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {getUniqueValues(filteredData, (item) => item.route).map(
              (route) => (
                <SelectItem key={route} value={route}>
                  {route}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleFilterChange("doseForm", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Dose Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {getUniqueValues(filteredData, (item) => item.doseForm).map(
              (doseForm) => (
                <SelectItem key={doseForm} value={doseForm}>
                  {doseForm}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      {isLoading.get || isLoading.post ? (
        <LoadingButton />
      ) : (
        <DefaultDataTable
          columns={columns(handleSelectedMedication)}
          data={filteredData}
          pageNo={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      )}
      <MedicationDetailsDialog
        isOpen={isDetailsDialogOpen}
        userDetailsId={userDetailsId}
        selectedMedication={selectedMedication}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
};

export default AddMedicationBody;

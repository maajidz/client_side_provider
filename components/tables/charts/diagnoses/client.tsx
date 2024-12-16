'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns'
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { PastDiagnosesInterface, UserEncounterData } from '@/types/chartsInterface';
import { fetchDiagnoses } from '@/services/chartsServices';

export const DiagnosesClient = ({ onSelectionChange, patientDetails }: {
  onSelectionChange: (selected: PastDiagnosesInterface[]) => void;
  patientDetails: UserEncounterData
}) => {
  const [prevDiagnosis, setPrevDiagnosis] = useState<PastDiagnosesInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<PastDiagnosesInterface[]>([]);

  useEffect(() => {

    const fetchAndSetResponse = async () => {
      if (patientDetails.chart?.id) {
        setLoading(true);
        try {
          const response = await fetchDiagnoses({ chartId: patientDetails.chart?.id });
          if (response) {
            setPrevDiagnosis(response);
            console.log("Prev", prevDiagnosis)
          }
        } catch (e) {
          console.log("Error", e)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAndSetResponse();
  }, [patientDetails.chart?.id]);

  useEffect(() => {
    onSelectionChange(selectedRows);
  }, [selectedRows, onSelectionChange]);

  const handleRowSelection = (row: PastDiagnosesInterface, isSelected: boolean) => {
    setSelectedRows((prev) =>
      isSelected
        ? [...prev, row]
        : prev.filter((selected) => selected.id !== row.id)
    );
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      {prevDiagnosis && (
        <DataTable
          searchKey="name"
          columns={columns(handleRowSelection)}
          data={prevDiagnosis}
          pageNo={1}
          totalPages={1}
          onPageChange={()=> {}}
        />
      )}

    </>
  );
};

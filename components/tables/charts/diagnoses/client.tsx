'use client';

import { DefaultDataTable } from '@/components/custom_buttons/table/DefaultDataTable';
import { columns } from './columns'
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { PastDiagnosesInterface } from '@/types/chartsInterface';
import { fetchDiagnoses } from '@/services/chartsServices';

export const DiagnosesClient = ({ onSelectionChange, chartID }: {
  onSelectionChange: (selected: PastDiagnosesInterface[]) => void;
  chartID: string
}) => {
  const [prevDiagnosis, setPrevDiagnosis] = useState<PastDiagnosesInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<PastDiagnosesInterface[]>([]);

  useEffect(() => {

    const fetchAndSetResponse = async () => {
      if (chartID) {
        setLoading(true);
        try {
          const response = await fetchDiagnoses({ chartId: chartID});
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
  }, [chartID, prevDiagnosis]);

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
        <DefaultDataTable
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

import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { deleteDiagnoses, fetchDiagnoses } from '@/services/chartsServices';
import { PastDiagnosesInterface, UserEncounterData } from '@/types/chartsInterface';
import { showToast } from '@/utils/utils';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Icon } from '@/components/ui/icon';
import { ColumnDef } from '@tanstack/react-table';

interface PastDiagnosisRow {
    id: string;
    type: {
        diagnosis_name: string;
        ICD_Code: string;
    };
    notes: string;
}

const PastDxBody = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [prevDiagnosis, setPrevDiagnosis] = useState<PastDiagnosesInterface[]>([]);
    const { toast } = useToast();

    const fetchAndSetResponse = useCallback(async () => {
        if (patientDetails.chart?.id) {
            setLoading(true);
            try {
                const response = await fetchDiagnoses({ chartId: patientDetails.chart?.id });
                if (response) {
                    setPrevDiagnosis(response);
                    console.log("Fetched Diagnoses:", response);
                }
            } catch (e) {
                console.error("Error", e);
            } finally {
                setLoading(false);
            }
        }
    }, [patientDetails.chart?.id]);

    useEffect(() => {
        fetchAndSetResponse();
    }, [patientDetails?.chart?.id, fetchAndSetResponse]);

    const handleDeleteDiagnoses = useCallback(async (diagnosesId: string) => {
        setLoading(true);
        try {
            await deleteDiagnoses({ diagnosisId: diagnosesId });
            showToast({ toast, type: "success", message: "Deleted successfully!" });
            setPrevDiagnosis((prev) =>
                prev.filter((diagnosis) => diagnosis.id !== diagnosesId)
            );
        } catch (e) {
            console.log("Error", e);
            showToast({ toast, type: "error", message: "Failed to delete Diagnosis" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleChange = useCallback((index: number, field: string, value: string) => {
        const updatedDiagnoses = [...prevDiagnosis];
        updatedDiagnoses[index] = { ...updatedDiagnoses[index], [field]: value };
        setPrevDiagnosis(updatedDiagnoses);
    }, [prevDiagnosis]);

    const columns: ColumnDef<PastDiagnosisRow>[] = useMemo(() => [
        {
            accessorKey: "type.diagnosis_name",
            header: "Diagnosis",
            cell: ({ row }) => (
                <Input
                    type="text"
                    placeholder="Enter Diagnosis"
                    value={row.original.type.diagnosis_name}
                    onChange={(e) => handleChange(row.index, 'diagnosis_name', e.target.value)}
                    disabled
                />
            ),
        },
        {
            accessorKey: "type.ICD_Code",
            header: "ICD Codes",
            cell: ({ row }) => (
                <Input
                    type="text"
                    placeholder="ICD Codes"
                    value={row.original.type.ICD_Code}
                    onChange={(e) => handleChange(row.index, 'ICD_Code', e.target.value)}
                    disabled
                />
            ),
        },
        {
            accessorKey: "notes",
            header: "Notes",
            cell: ({ row }) => (
                <Input
                    type="text"
                    placeholder="Notes"
                    value={row.original.notes}
                    onChange={(e) => handleChange(row.index, 'notes', e.target.value)}
                    disabled
                />
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant={'ghost'}
                        onClick={() => handleDeleteDiagnoses(row.original.id)}
                    >
                        <Icon name="remove" />
                    </Button>
                </div>
            ),
        },
    ], [handleChange, handleDeleteDiagnoses]);

    return (
        <div className='flex flex-col gap-4'>
            {loading ? (
                <LoadingButton />
            ) : (
                <DefaultDataTable
                    columns={columns}
                    data={prevDiagnosis}
                    pageNo={1}
                    totalPages={1}
                    onPageChange={() => {}}
                />
            )}
        </div>
    );
};

export default PastDxBody;
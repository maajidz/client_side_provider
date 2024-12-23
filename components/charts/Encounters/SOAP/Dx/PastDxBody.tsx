import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { deleteDiagnoses, fetchDiagnoses, updateDiagnoses } from '@/services/chartsServices';
import { PastDiagnosesInterface, UserEncounterData } from '@/types/chartsInterface';
import { showToast } from '@/utils/utils';
import { Save, TrashIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'

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
                    console.log("Prev", response);
                }
            } catch (e) {
                console.error("Error", e);
            } finally {
                setLoading(false);
            }
        }
    }, [patientDetails.chart?.id]);

    useEffect(()=> {
        fetchAndSetResponse();
    }, [patientDetails?.chart?.id, fetchAndSetResponse]);

    const handleDeleteDiagnoses = async (diagnosesId: string) => {
        setLoading(true);
        try {
            await deleteDiagnoses({ diagnosisId: diagnosesId });
            showToast({ toast, type: "success", message: "Deleted succesfully!" })
            setPrevDiagnosis((prev) =>
                prev.filter((diagnosis) => diagnosis.id !== diagnosesId)
            );
        } catch (e) {
            console.log("Error", e)
            showToast({ toast, type: "error", message: "Failed to delete Diagnosis" })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (index: number, field: string, value: string) => {
        const updatedDiagnoses = [...prevDiagnosis];
        updatedDiagnoses[index] = { ...updatedDiagnoses[index], [field]: value };
        setPrevDiagnosis(updatedDiagnoses);
    }

    const handleUpdateDiagnoses = async (diagnosisId: string, updatedData: PastDiagnosesInterface) => {
        setLoading(true);
        try {
            const requestBody = {
                diagnosis_name: updatedData.diagnosis_name,
                ICD_Code: updatedData.ICD_Code,
                notes: updatedData.notes,
            }
            const response = await updateDiagnoses({ diagnosisId, requestData: requestBody });
            if (response) {
                showToast({ toast, type: "success", message: "Updated successfully!" })
                setPrevDiagnosis(prev =>
                    prev.map(diagnosis =>
                        diagnosis.id === diagnosisId ? { ...diagnosis, ...updatedData } : diagnosis
                    )
                );
            }
        } catch (e) {
            console.log("Error", e);
            showToast({ toast, type: "error", message: "Failed to update Diagnosis" })
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        <div>
            <LoadingButton />
        </div>
    }

    return (
        <div className='flex flex-col gap-4'>
            {prevDiagnosis.length> 0 && (
                <div className="flex gap-3">
                <div className='w-32'>Diagnosis</div>
                <div className='w-32'>ICD Codes</div>
                <div className='w-32'>Notes</div>
            </div>
            )}
            <div className='flex flex-col gap-2'>
                {prevDiagnosis && prevDiagnosis.length > 0 ? prevDiagnosis.map((diagnoses, index) => (
                    <div className="flex justify-between gap-2" key={diagnoses.id}>
                        <Input
                            type="text"
                            placeholder="Enter Diagnosis"
                            value={diagnoses.diagnosis_name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            className="col-span-4 border rounded sm:max-w-32"
                        />
                        <Input
                            type="text"
                            placeholder="ICD Codes"
                            value={diagnoses.ICD_Code}
                            onChange={(e) => handleChange(index, 'ICD_Code', e.target.value)}
                            className="col-span-4 border rounded sm:max-w-32 "
                        />
                        <Input
                            type="text"
                            placeholder="Notes"
                            value={diagnoses.notes}
                            onChange={(e) => handleChange(index, 'notes', e.target.value)}
                            className="col-span-3 border rounded sm:max-w-32"
                        />
                        <Button variant={'ghost'}
                            onClick={() => {
                                console.log("Id", diagnoses.id)
                                handleDeleteDiagnoses(diagnoses.id)
                            }}
                        >
                            <TrashIcon />
                        </Button>
                        <Button type="submit" variant={'ghost'} onClick={() => handleUpdateDiagnoses(diagnoses.id, diagnoses)} className='text-[#84012A]'> <Save /></Button>
                    </div>
                )) : (
                    <div>
                        No Past Diagnoses found!
                    </div>
                )}
            </div>
        </div>
    )
}

export default PastDxBody
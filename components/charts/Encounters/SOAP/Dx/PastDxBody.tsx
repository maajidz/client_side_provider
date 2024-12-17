import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { deleteDiagnoses, updateDiagnoses } from '@/services/chartsServices';
import { PastDiagnosesInterface } from '@/types/chartsInterface';
import { Check, TrashIcon, X } from 'lucide-react';
import React, { useState } from 'react'

const PastDxBody = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [prevDiagnosis, setPrevDiagnosis] = useState<PastDiagnosesInterface[]>([]);
    const { toast } = useToast();
    const handleDeleteDiagnoses = async (diagnosesId: string) => {
        setLoading(true);
        try {
            await deleteDiagnoses({ diagnosisId: diagnosesId });
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                    <div>Deleted succesfully!</div>
                </div>,
            });
            setPrevDiagnosis((prev) =>
                prev.filter((diagnosis) => diagnosis.id !== diagnosesId)
            );
        } catch (e) {
            console.log("Error", e)
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>Failed to delete Diagnosis</div>
                </div>
            });
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
                toast({
                    className: cn("top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"),
                    variant: "default",
                    description: <div className='flex flex-row items-center gap-4'>
                        <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                        <div>Updated successfully!</div>
                    </div>,
                });

                setPrevDiagnosis(prev =>
                    prev.map(diagnosis =>
                        diagnosis.id === diagnosisId ? { ...diagnosis, ...updatedData } : diagnosis
                    )
                );
            }
        } catch (e) {
            console.log("Error", e);
            toast({
                className: cn("top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>Failed to update Diagnosis</div>
                </div>,
            });
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
                    <div className="flex justify-between" key={diagnoses.id}>
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
                        <Button type="submit" onClick={() => handleUpdateDiagnoses(diagnoses.id, diagnoses)} className='bg-[#84012A]'>Save changes</Button>
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
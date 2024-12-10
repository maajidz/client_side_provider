import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PastDiagnosesInterface, UserEncounterData } from '@/types/chartsInterface'
import { Check, TrashIcon, X } from 'lucide-react'
import { deleteDiagnoses, fetchDiagnoses, updateDiagnoses } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import { cn } from '@/lib/utils'
import { useToast } from "@/components/ui/use-toast";

const PastDx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [prevDiagnosis, setPrevDiagnosis] = useState<PastDiagnosesInterface[]>([]);
    const { toast } = useToast();

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
                diagnosis: updatedData.name,
                icdCode: updatedData.ICD_Code,
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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Past Dx</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Past Diagnoses</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className="flex gap-3">
                        <div className='w-32'>Diagnosis</div>
                        <div className='w-32'>ICD Codes</div>
                        <div className='w-32'>Notes</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {prevDiagnosis && prevDiagnosis.length > 0 ? prevDiagnosis.map((diagnoses, index) => (
                            <div className="flex justify-between" key={diagnoses.id}>
                                <Input
                                    type="text"
                                    placeholder="Enter Diagnosis"
                                    value={diagnoses.name}
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
                <DialogFooter>
                       
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PastDx
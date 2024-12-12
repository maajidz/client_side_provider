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
import { Check, TrashIcon, X } from 'lucide-react'
import { UserEncounterData } from '@/types/chartsInterface'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { createDiagnoses, createSOAPChart } from '@/services/chartsServices'

const AddDx = ({ patientDetails, encounterId }: { patientDetails: UserEncounterData, encounterId: string }) => {
    const { toast } = useToast();
    const [rows, setRows] = useState([
        { diagnosis_name: '', ICD_Code: '', notes: '' },
    ]);

    const handleAddRow = () => {
        setRows([...rows, { diagnosis_name: '', ICD_Code: '', notes: '' }]);
    };

    const handleDeleteRow = (index: number) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleChange = (index: number, field: string, value: string) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
    };

    const handleSubmit = async () => {
        console.log('Diagnoses:', rows);
        try {
            if (patientDetails.chart?.id) {
                const chartId = patientDetails.chart?.id;
                const requestData = rows.map((row) => ({
                    ...row,
                    chartId,
                }));
                await createDiagnoses({ requestData: requestData })
                toast({
                    className: cn(
                        "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                    ),
                    variant: "default",
                    description: <div className='flex flex-row items-center gap-4'>
                        <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                        <div>Saved!</div>
                    </div>,
                });
            } else {
                const data = {
                    subjective: "",
                    assessment: `Diagnoses: ${rows} `,
                    encounterId: encounterId
                }
                const response = await createSOAPChart({ requestData: data })
                if (response) {
                    const chartId = response.id;
                    const requestData = rows.map((row) => ({
                        ...row,
                        chartId,
                    }));
                    await createDiagnoses({ requestData: requestData })
                    toast({
                        className: cn(
                            "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                        ),
                        variant: "default",
                        description: <div className='flex flex-row items-center gap-4'>
                            <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                            <div>Saved!</div>
                        </div>,
                    });
                }
            }
        } catch (e) {
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>Error while saving</div>
                </div>
            });
            console.log("Error", e);
        } finally {
            setRows([{ diagnosis_name: '', ICD_Code: '', notes: '' }]);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Add Dx</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Diagnoses</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className="flex gap-3">
                        <div className='w-32'>Diagnosis</div>
                        <div className='w-32'>ICD Codes</div>
                        <div className='w-32'>Notes</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {rows.map((row, index) => (
                            <div className="flex justify-between" key={index}>
                                <Input
                                    type="text"
                                    placeholder="Enter Diagnosis"
                                    value={row.diagnosis_name}
                                    onChange={(e) => handleChange(index, 'diagnosis_name', e.target.value)}
                                    className="col-span-4 border rounded sm:max-w-32"
                                />
                                <Input
                                    type="text"
                                    placeholder="ICD Codes"
                                    value={row.ICD_Code}
                                    onChange={(e) => handleChange(index, 'ICD_Code', e.target.value)}
                                    className="col-span-4 border rounded sm:max-w-32 "
                                />
                                <Input
                                    type="text"
                                    placeholder="Notes"
                                    value={row.notes}
                                    onChange={(e) => handleChange(index, 'notes', e.target.value)}
                                    className="col-span-3 border rounded sm:max-w-32"
                                />
                                <Button variant={'ghost'}
                                    onClick={() => handleDeleteRow(index)}
                                >
                                    <TrashIcon />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <div className='flex justify-between w-full'>
                        <Button variant={'ghost'} onClick={handleAddRow} > Add Row</Button>
                        <Button type="submit" onClick={handleSubmit} className='bg-[#84012A]' disabled = {rows[0].diagnosis_name == '' ? true: false}>Save changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddDx
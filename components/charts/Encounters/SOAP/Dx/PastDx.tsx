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
import { UserEncounterData } from '@/types/chartsInterface'
import { TrashIcon } from 'lucide-react'

const PastDx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    // const { toast } = useToast();
    // const [prevDiagnosis, setPrevDiagnosis] = useState();
    const [rows, setRows] = useState([
        { diagnosis: '', icdCode: '', notes: '' },
    ]);

    const handleAddRow = () => {
        setRows([...rows, { diagnosis: '', icdCode: '', notes: '' }]);
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

    const handleSubmit = async () => {}
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Past Dx</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Past Diagnoses</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    {patientDetails.chart?.id}
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
                                    value={row.diagnosis}
                                    onChange={(e) => handleChange(index, 'diagnosis', e.target.value)}
                                    className="col-span-4 border rounded sm:max-w-32"
                                />
                                <Input
                                    type="text"
                                    placeholder="ICD Codes"
                                    value={row.icdCode}
                                    onChange={(e) => handleChange(index, 'icdCode', e.target.value)}
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
                        <Button variant={'ghost'} onClick={handleAddRow}> More</Button>
                        <div className='flex gap-3'>
                            <Button type="submit" onClick={handleSubmit} className='bg-[#84012A]'>Save changes</Button>
                            <Button variant={'outline'} onClick={handleAddRow}> Cancel</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PastDx
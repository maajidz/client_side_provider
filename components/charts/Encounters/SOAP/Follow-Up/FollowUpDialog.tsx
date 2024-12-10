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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {  Check, Trash2Icon, X } from 'lucide-react';
import { UserEncounterData } from '@/types/chartsInterface';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { createFollowUp, createSOAPChart } from '@/services/chartsServices';

interface Row {
    type: string;
    notes: string;
    sectionDateType: 'after' | 'before';
    sectionDateNumber: number;
    sectionDateUnit: 'days' | 'weeks' | 'months';
    reminders: Array<'email' | 'text' | 'voice'>;
}

const FollowUpDialog = ({ patientDetails, encounterId }: { patientDetails: UserEncounterData, encounterId: string }) => {
    const { toast } = useToast();
    const [rows, setRows] = useState<Row[]>([
        { type: '', notes: '', sectionDateType: 'after', sectionDateNumber: 0, sectionDateUnit: 'weeks', reminders: [] },
    ]);

    const handleAddRow = () => {
        setRows([...rows, { type: '', notes: '', sectionDateType: 'after', sectionDateNumber: 0, sectionDateUnit: 'weeks', reminders: [] }]);
    };

    const handleDeleteRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: string, value: string) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
    };

    const handleReminderChange = (index: number, reminderType: 'email' | 'text' | 'voice', value: boolean) => {
        const updatedRows = rows.map((row, i) => {
            if (i === index) {
                const updatedReminders = value
                  ? [...new Set([...row.reminders, reminderType])]
                  : row.reminders.filter(reminder => reminder !== reminderType);
                return { ...row, reminders: updatedReminders };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleSubmit = async() => {
        console.log('Follow-Up:', rows);
        try {
            if (patientDetails.chart?.id) {
                const chartId = patientDetails.chart?.id;
                const requestData = rows.map((row) => ({
                    ...row,
                    chartId
                }));
                console.log('Follow-Up:', requestData)
                await createFollowUp({ requestData: requestData })
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
                    plan: `Follow Up: ${rows} `,
                    encounterId: encounterId
                }
                const response = await createSOAPChart({ requestData: data })
                if (response) {
                    const chartId = response.id;
                    const requestData = rows.map((row) => ({
                        ...row,
                        chartId
                    }));
                    await createFollowUp({ requestData: requestData })
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
            setRows([ { type: '', notes: '', sectionDateType: 'after', sectionDateNumber: 0, sectionDateUnit: 'weeks', reminders: [] }]);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Add Follow up</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Add Follow Up</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto p-2">
                    <div className='flex flex-col gap-5'>
                        <div className='flex gap-3'>
                            <div className='w-48'>Type</div>
                            <div className='w-56'>Notes</div>
                            <div className='w-60'>Date</div>
                            <div >Reminder</div>
                            <div >Actions</div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            {rows.map((row, index) => (
                                <div key={index} className='flex justify-between'>
                                    <Select
                                        onValueChange={(value) => handleChange(index, 'type', value)}
                                    >
                                        <SelectTrigger className="w-44">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Follow-Up Types</SelectLabel>
                                                <SelectItem value="Follow-Up Type 1">Follow-Up Type 1</SelectItem>
                                                <SelectItem value="Follow-Up Type 2">Follow-Up Type 2</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Textarea
                                        value={row.notes}
                                        onChange={(e) => handleChange(index, 'notes', e.target.value)}
                                        placeholder="Enter notes"
                                        className="w-56"
                                    />
                                    <div className='flex gap-3'>
                                        <Select
                                            value={row.sectionDateType}
                                            onValueChange={(value) => handleChange(index, 'sectionDateType', value)}
                                        >
                                            <SelectTrigger className="w-fit border rounded">
                                                <SelectValue placeholder="Select Date sectionDateUnit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="after">After</SelectItem>
                                                    <SelectItem value="before">Before</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="number"
                                            value={row.sectionDateNumber}
                                            onChange={(e) => handleChange(index, 'sectionDateNumber', e.target.value)}
                                            className="w-16 border rounded"
                                        />
                                        <Select
                                            value={row.sectionDateUnit}
                                            onValueChange={(value) => handleChange(index, 'sectionDateUnit', value)}
                                        >
                                            <SelectTrigger className="w-fit border rounded">
                                                <SelectValue placeholder="Select sectionDateUnit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="days">Days</SelectItem>
                                                    <SelectItem value="weeks">Weeks</SelectItem>
                                                    <SelectItem value="months">Months</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='flex flex-col gap-3 '>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={row.reminders.includes('email')}
                                                onCheckedChange={(checked) =>
                                                    handleReminderChange(index, "email", Boolean(checked))
                                                }
                                            />
                                            <span>Email</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={row.reminders.includes('text')}
                                                onCheckedChange={(checked) =>
                                                    handleReminderChange(index, "text", Boolean(checked))
                                                }
                                            />
                                            <span>Text</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={row.reminders.includes('voice')}
                                                onCheckedChange={(checked) =>
                                                    handleReminderChange(index, "voice", Boolean(checked))
                                                }
                                            />
                                            <span>Voice</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => handleDeleteRow(index)}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className='flex justify-between w-full'>
                        <Button variant={'ghost'} onClick={handleAddRow} className="text-blue-500 underline"> More</Button>
                        <div className='flex gap-3'>
                            <Button type="submit" onClick={handleSubmit} className='bg-[#84012A]'>Save changes</Button>
                            <Button variant={'outline'} > Cancel</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FollowUpDialog
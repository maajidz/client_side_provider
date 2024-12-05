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
import { Trash2Icon } from 'lucide-react';

const FollowUpDialog = () => {
    const [rows, setRows] = useState([
        { type: '', notes: '', dateUnit: 'after', duration: '', unit: 'weeks', reminders: { email: false, text: false, voice: false } },
    ]);

    const handleAddRow = () => {
        setRows([...rows, { type: '', notes: '', dateUnit: 'after', duration: '', unit: 'weeks', reminders: { email: false, text: false, voice: false } }]);
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

    const handleReminderChange = (index: number, reminderType: string, value: boolean) => {
        const updatedRows = rows.map((row, i) =>
            i === index
                ? { ...row, reminders: { ...row.reminders, [reminderType]: value } }
                : row
        );
        setRows(updatedRows);
    };

    const handleSubmit = () => {
        console.log('Follow-up Data:', rows);
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
                                            value={row.dateUnit}
                                            onValueChange={(value) => handleChange(index, 'dateUnit', value)}
                                        >
                                            <SelectTrigger className="w-fit border rounded">
                                                <SelectValue placeholder="Select Date Unit" />
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
                                            value={row.duration}
                                            onChange={(e) => handleChange(index, 'duration', e.target.value)}
                                            className="w-16 border rounded"
                                        />
                                        <Select
                                            value={row.unit}
                                            onValueChange={(value) => handleChange(index, 'unit', value)}
                                        >
                                            <SelectTrigger className="w-fit border rounded">
                                                <SelectValue placeholder="Select Unit" />
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
                                                checked={row.reminders.email}
                                                onCheckedChange={(checked) =>
                                                    handleReminderChange(index, "email", Boolean(checked))
                                                }
                                            />
                                            <span>Email</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={row.reminders.text}
                                                onCheckedChange={(checked) =>
                                                    handleReminderChange(index, "text", Boolean(checked))
                                                }
                                            />
                                            <span>Text</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={row.reminders.voice}
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
import React from 'react'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const PrescriptionBody = () => {
    return (
        <div className='flex justify-between border-b pb-3'>
            <div>Prescriptions</div>
            <div className="flex h-5 items-center space-x-4 text-sm">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className='text-blue-500 underline'>Add Rx</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Add Prescription</DialogTitle>
                        </DialogHeader>
                        <div className='flex flex-col gap-2'>
                            <div className="flex gap-3 p-1 border rounded-lg">
                                <div className='flex flex-col border-r p-3'>
                                    <div>Patient Name</div>
                                    <div>Patient ID</div>
                                    <div className='flex gap-2'>
                                        <div>Gender</div>
                                        <div>/</div>
                                        <div>DOB</div>
                                    </div>
                                    <div>Address</div>
                                    <div>Phone No: Phoneno</div>
                                    <div>Cell: cell</div>
                                    <div>Vitals: weight</div>
                                </div>
                                <div className='flex flex-col p-3'>
                                    <div>Provider Name</div>
                                    <div>Provider ID</div>
                                    <div>Facility</div>
                                    <div>Address</div>
                                    <div>Phone No: Phoneno</div>
                                    <div>Fax: Fax</div>
                                </div>
                            </div>
                            <div className='flex flex-col p-3 rounded-lg border'>
                                <div className='flex'>
                                    <div>Search & Add Rx</div>
                                    <Input />
                                </div>
                                <div className='flex items-center'>
                                    <div className='flex text-center'>Please search for your drug. If not found,</div>
                                    <Button variant={'ghost'} className='text-[#84012A]'>Add a custom drug</Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Separator orientation="vertical" />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className='text-blue-500 underline'>Past Rx</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Prescription</DialogTitle>
                        </DialogHeader>
                        <div className='flex flex-col gap-2'>
                            <div className="flex gap-3 p-1 border rounded-lg">
                                <div className='flex flex-col border-r p-3'>
                                    <div>Patient Name</div>
                                    <div>Patient ID</div>
                                    <div className='flex gap-2'>
                                        <div>Gender</div>
                                        <div>/</div>
                                        <div>DOB</div>
                                    </div>
                                    <div>Address</div>
                                    <div>Phone No: Phoneno</div>
                                    <div>Cell: cell</div>
                                    <div>Vitals: weight</div>
                                </div>
                                <div className='flex flex-col p-3'>
                                    <div>Provider Name</div>
                                    <div>Provider ID</div>
                                    <div>Facility</div>
                                    <div>Address</div>
                                    <div>Phone No: Phoneno</div>
                                    <div>Fax: Fax</div>
                                </div>
                            </div>
                            <div className='flex flex-col p-3 rounded-lg border'>
                                <div className='flex'>
                                    <div>Search & Add Rx</div>
                                    <Input />
                                </div>
                                <div className='flex items-center'>
                                    <div >Please search for your drug. If not found,</div>
                                    <Button variant={'ghost'} className='text-[#84012A]'>Add a custom drug</Button>
                                </div>
                            </div>
                            <div className='flex flex-col p-3 rounded-lg border'>
                                <div>Past Rx</div>
                                <div className='flex items-center'>

                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Separator orientation="vertical" />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className='text-blue-500 underline'>Sign</Button>
                    </PopoverTrigger>
                    <PopoverContent className="">
                        <div className="">
                            <Button variant={"ghost"}>Sign Rx</Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <Separator orientation="vertical" />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className='text-blue-500 underline'>Transmit</Button>
                    </PopoverTrigger>
                    <PopoverContent className="">
                        <div className="">
                            <Button variant={"ghost"}>Paper Rx</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default PrescriptionBody
import React, { useState } from 'react'
import WysiwygComponent from '@/components/custom_buttons/editors/WysiwygComponent'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DiagnosesClient } from '@/components/tables/charts/diagnoses/client'
import { UserData } from '@/types/userInterface'
import { TrashIcon } from 'lucide-react'

const ReferralDialog = () => {
    const [selectedDiagnoses, setSelectedDiagnoses] = useState<UserData[]>([]);

    const handleSelectedDiagnoses = (selected: UserData[]) => {
        setSelectedDiagnoses(selected);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Add Referral</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[98rem]">
                <DialogHeader>
                    <DialogTitle>Patient Details</DialogTitle>
                    <DialogDescription>
                        <div className='flex justify-between'>
                            <div>Add Referral Out</div>
                            <div className='flex gap-3'>
                                <Button className='bg-[#84012A]'>Save</Button>
                                <Button variant={'outline'}>Preview</Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col'>
                    <div className='flex w-full'>
                        <div className='flex flex-col border p-3 w-full'>
                            <div>Patient</div>
                            <div>Patient Name</div>
                        </div>
                        <div className='flex flex-col border p-3 w-full'>
                            <div>Referral From</div>
                            <div>Provider Name</div>
                        </div>
                        <div className='flex flex-col border p-3 w-full'>
                            <div className='flex gap-2 items-center'>
                                <div>Referral To:</div>
                                <div>
                                    <RadioGroup defaultValue="external" className='flex items-center text-center'>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="external" id="external" />
                                            <Label htmlFor="external">External</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="internal" id="internal" />
                                            <Label htmlFor="internal">Internal</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div>Provider Name</div>
                        </div>
                    </div>
                    <div className='flex flex-col border p-2 w-full'>
                        <div className='flex'>
                            <div>Referral Reason:</div>
                            <Input />
                        </div>
                        <div className='flex w-full justify-between'>
                            <div className='flex'>
                                <div>Referral date:</div>
                                <Input type='date' />
                            </div>
                            <div className='flex'>
                                <div>Priority:</div>
                                <Input />
                            </div>
                            <div className='flex'>
                                <div>Related Encounter:</div>
                                <Input />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col border p-2'>
                        <div>Referral Notes</div>
                        <WysiwygComponent />
                    </div>
                    <div className='flex w-full'>
                        <div className='flex w-full flex-col gap-3  border p-3 '>
                            <div className='flex w-full items-center justify-between'>
                                <div>Diagnoses</div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className='text-blue-400'>Choose</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Diagnoses</DialogTitle>
                                            <DiagnosesClient onSelectionChange={handleSelectedDiagnoses} />
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div>
                                {selectedDiagnoses.length > 0 ? (
                                    <ul>
                                        {selectedDiagnoses.map((diagnosis) => (
                                            <li key={diagnosis.id}>
                                                <div className='flex justify-between'> 
                                                    <div>{diagnosis.firstName} {diagnosis.lastName}</div>
                                                    <Button variant={'ghost'} onClick={()=> {
                                                        setSelectedDiagnoses((prevDiagnoses) =>
                                                            prevDiagnoses.filter((d) => d.id !== diagnosis.id)
                                                          );
                                                    }}><TrashIcon /> </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>No diagnoses selected</div>
                                )}
                            </div>
                        </div>
                        <div className='flex border p-3 w-full items-center justify-between'>
                            <div>Insurance</div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className='text-blue-400'>Choose</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Insurance</DialogTitle>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className='flex border p-3 w-full items-center justify-between'>
                            <div>Attachements</div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className='text-blue-400'>Attach</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <span>Chart Notes</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Face Sheet</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Growth Chart</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Labs</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Images</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Patient Documents</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>From Local Drive</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReferralDialog
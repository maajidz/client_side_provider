import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { UserEncounterData } from '@/types/chartsInterface'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const TabMenu = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    return (
        <div className='flex flex-row gap-5'>
            {/* {patientDetails.chart === null ? (
                <div> </div>
            ): (
                <Button>Save</Button>
            )} */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'outline'} className=''>Preview</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className='flex flex-col gap-2'>
                            <div>Subjective</div>
                            <div dangerouslySetInnerHTML={{ __html: patientDetails.chart?.subjective || '' }} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>Objective</div>
                            <div>{patientDetails.chart?.objective}</div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>Assessment</div>
                            <div>{patientDetails.chart?.assessment}</div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>Plan</div>
                            <div>{patientDetails.chart?.plan}</div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* <Button variant={'outline'} className=''>Sign</Button> */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Print Patient Summary</DropdownMenuItem>
                    <DropdownMenuItem>Print Chart Notes</DropdownMenuItem>
                    <DropdownMenuItem>Import Medical History</DropdownMenuItem>
                    <DropdownMenuItem>Import Family Histoty</DropdownMenuItem>
                    <DropdownMenuItem>Import Social History</DropdownMenuItem>
                    <DropdownMenuItem>Import Images</DropdownMenuItem>
                    <DropdownMenuItem>Reports</DropdownMenuItem>
                    <DropdownMenuItem>File For Review</DropdownMenuItem>
                    <DropdownMenuItem>Quick Message</DropdownMenuItem>
                    <DropdownMenuItem>Surveillance Report</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant={'outline'} className=''>Close</Button>
        </div>
    )
}

export default TabMenu
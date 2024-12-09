import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'

const TabMenu = () => {
    return (
        <div className='flex flex-row gap-5'>
            {/* {patientDetails.chart === null ? (
                <div> </div>
            ): (
                <Button>Save</Button>
            )} */}
            <Button variant={'outline'} className=''>Preview</Button>
            <Button variant={'outline'} className=''>Sign</Button>
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
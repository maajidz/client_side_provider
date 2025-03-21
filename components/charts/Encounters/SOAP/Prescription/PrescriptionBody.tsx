import React from 'react'
import AddRx from './AddRx'
import PastRx from './PastRx'
import { UserEncounterData } from '@/types/chartsInterface'
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"

const PrescriptionBody = ({patientDetails, encounterId}: {patientDetails: UserEncounterData, encounterId: string }) => {
    
    return (
        <div className='flex justify-between border-b pb-3'>
            <label className='text-sm font-semibold'>Prescriptions</label>
            <div className="flex h-5 items-center space-x-4 text-sm">
                <AddRx patientDetails={patientDetails} encounterId={encounterId} />
                <PastRx patientDetails={patientDetails} encounterId={encounterId} />
                {/* <Popover>
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
                </Popover> */}
            </div>
        </div>
    )
}

export default PrescriptionBody
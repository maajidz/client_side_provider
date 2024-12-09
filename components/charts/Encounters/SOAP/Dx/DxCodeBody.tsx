import React from 'react'
import { Separator } from '@/components/ui/separator'
import AddDx from './AddDx'
import PastDx from './PastDx'
import { UserEncounterData } from '@/types/chartsInterface'

const DxCodeBody = ({patientDetails, encounterId}: {patientDetails: UserEncounterData,encounterId: string }) => {
    
    return (
        <div className='flex justify-between border-b pb-3'>
            <div>Dx Codes</div>
            <div className="flex h-5 items-center space-x-4 text-sm">
                <AddDx patientDetails={patientDetails} encounterId={encounterId} />
                <Separator orientation="vertical" />
                <PastDx patientDetails={patientDetails}/>
            </div>
        </div>
    )
}

export default DxCodeBody
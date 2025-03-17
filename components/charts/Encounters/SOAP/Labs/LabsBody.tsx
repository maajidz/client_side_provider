import React from 'react'
import { Separator } from '@/components/ui/separator'
import AddLabsDialog from './AddLabsDialog'
import PastOrdersDialog from './PastOrdersDialog'
import ViewOrdersDialog from './ViewOrdersDialog'
import SearchAndAddDrawer from './SearchAndAddDrawer'
import { UserEncounterData } from '@/types/chartsInterface'

const LabsBody = ({ patientDetails}: {patientDetails: UserEncounterData}) => {
  return (
    <div className='flex justify-between border-b pb-3'>
                <div>Labs</div>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <SearchAndAddDrawer userDetailsId={patientDetails.userDetails.userDetailsId} />
                    <Separator orientation="vertical" />
                    <AddLabsDialog userDetailsId={patientDetails.userDetails.userDetailsId} />
                    <Separator orientation="vertical" />
                    <PastOrdersDialog userDetailsId={patientDetails.userDetails.userDetailsId}/>
                    {/* <Separator orientation="vertical" />
                    <MapDxDialog /> */}
                    <Separator orientation="vertical" />
                    <ViewOrdersDialog userDetailsId={patientDetails.userDetails.userDetailsId}/>
                </div>
            </div>
  )
}

export default LabsBody
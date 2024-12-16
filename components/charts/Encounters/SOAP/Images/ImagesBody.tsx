import React from 'react'
import { Separator } from '@/components/ui/separator'
import AddImagesDrawer from './AddImagesDrawer'
import PastImageOrders from './PastImageOrders'
import { UserEncounterData } from '@/types/chartsInterface'
// import MapDx from './MapDx'

const ImagesBody = ({ patientDetails}: { patientDetails: UserEncounterData}) => {
  return (
    <div className='flex justify-between border-b pb-3'>
                <div>Images</div>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <AddImagesDrawer patientDetails={patientDetails} />
                    <Separator orientation="vertical" />
                    <PastImageOrders patientDetails={patientDetails}/>
                    {/* <Separator orientation="vertical" />
                    <MapDx /> */}
                </div>
            </div>
  )
}

export default ImagesBody
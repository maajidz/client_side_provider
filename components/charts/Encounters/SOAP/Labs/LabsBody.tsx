import React from 'react'
import { Separator } from '@/components/ui/separator'
import AddLabsDialog from './AddLabsDialog'
import PastOrdersDialog from './PastOrdersDialog'
import MapDxDialog from './MapDxDialog'
import ViewOrdersDialog from './ViewOrdersDialog'
import SearchAndAddDrawer from './SearchAndAddDrawer'

const LabsBody = () => {
  return (
    <div className='flex justify-between border-b pb-3'>
                <div>Labs</div>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <SearchAndAddDrawer />
                    <Separator orientation="vertical" />
                    <AddLabsDialog />
                    <Separator orientation="vertical" />
                    <PastOrdersDialog />
                    <Separator orientation="vertical" />
                    <MapDxDialog />
                    <Separator orientation="vertical" />
                    <ViewOrdersDialog />
                </div>
            </div>
  )
}

export default LabsBody
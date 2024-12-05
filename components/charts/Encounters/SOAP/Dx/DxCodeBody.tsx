import React from 'react'
import { Separator } from '@/components/ui/separator'
import AddDx from './AddDx'
import PastDx from './PastDx'

const DxCodeBody = () => {
    
    return (
        <div className='flex justify-between border-b pb-3'>
            <div>Dx Codes</div>
            <div className="flex h-5 items-center space-x-4 text-sm">
                <AddDx />
                <Separator orientation="vertical" />
                <PastDx />
            </div>
        </div>
    )
}

export default DxCodeBody
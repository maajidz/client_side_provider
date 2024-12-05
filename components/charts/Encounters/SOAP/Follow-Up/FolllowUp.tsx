import React from 'react'
import FollowUpDialog from './FollowUpDialog'


const FolllowUp = () => {
    return (
        <div className='flex justify-between border-b pb-3'>
            <div>Follow Up</div>
            <div className="flex h-5 items-center space-x-4 text-sm">
            <FollowUpDialog />
            </div>
        </div>
    )
}

export default FolllowUp
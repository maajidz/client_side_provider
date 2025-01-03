import PageContainer from '@/components/layout/page-container'
import { LabResultsClient } from '@/components/tables/charts/labs/client'
import React from 'react'

const LabsPreview = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-6'>
                <h3 className='text-xl font-semibold text-bold-800'>Lab Results</h3>
                <hr className='border-t border-gray-300 mb-4' />
                <div className='flex flex-col gap-3 border-b'>
                   <LabResultsClient />
                </div>
            </div>
        </PageContainer>
    )
}

export default LabsPreview
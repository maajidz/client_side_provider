import PageContainer from '@/components/layout/page-container'
import { LabResultsClient } from '@/components/tables/charts/labs/client'
import React from 'react'

const LabsPreview = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-5'>
                Labs Result
                <div className='flex flex-col gap-3 border-b'>
                   <LabResultsClient />
                </div>
            </div>
        </PageContainer>
    )
}

export default LabsPreview
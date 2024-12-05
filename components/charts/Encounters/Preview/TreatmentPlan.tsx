import PageContainer from '@/components/layout/page-container'
import React from 'react'

const TreatmentPlan = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-5'>
                Treatment Plan
                <div className='flex flex-col gap-3 border-b'>
                    No Treatment Plan available in your account. Create Now
                </div>
            </div>
        </PageContainer>
    )
}

export default TreatmentPlan
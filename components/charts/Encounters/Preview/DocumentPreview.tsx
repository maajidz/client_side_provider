import PageContainer from '@/components/layout/page-container'
import React from 'react'

const DocumentPreview = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-5'>
                Documents
                <div className='flex flex-col gap-3 border-b'>
                    No Documents
                </div>
            </div>
        </PageContainer>
    )
}

export default DocumentPreview
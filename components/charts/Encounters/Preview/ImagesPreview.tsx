import ImageResults from '@/components/images/ImageResults/ImageResults'
import PageContainer from '@/components/layout/page-container'
import React from 'react'

const ImagesPreview = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-5'>
                Image Results
                <div className='flex flex-col gap-3 border-b'>
                   <ImageResults />
                </div>
            </div>
        </PageContainer>
    )
}

export default ImagesPreview
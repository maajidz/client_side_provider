import PageContainer from '@/components/layout/page-container'
import React from 'react'

const QuestionnairePreview = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-5'>
                Questionnaires
                <div className='flex flex-col gap-3 border-b'>
                    No questionnaire is associated to this encounter. Add Now
                </div>
            </div>
        </PageContainer>
    )
}

export default QuestionnairePreview
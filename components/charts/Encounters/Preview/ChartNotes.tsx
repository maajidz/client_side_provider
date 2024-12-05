import PageContainer from '@/components/layout/page-container'
import React from 'react'

const ChartNotes = () => {
    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-col gap-5'>
                Chart Notes
                <div className='flex flex-col gap-3 border-b'>
                    <ChartLabel label='Subjective' />
                    <div className='flex flex-col gap-2'>
                        <ChartSubLabel label='Chief Complaints' />
                        <ChartSubLabel label='History of Present Illness' />
                        <ChartSubLabel label='Past Medical History' />
                        <ChartSubLabel label='Active Medications:  ' />
                    </div>
                </div>
                <div className='flex flex-col gap-3 border-b'>
                    <ChartLabel label='Objective' />
                    <div className='flex flex-col gap-2'>
                        <ChartSubLabel label='Health Vitals' />
                    </div>
                </div>
                <div className='flex flex-col gap-3 border-b'>
                    <ChartLabel label='Assessment' />
                    <div className='flex flex-col gap-2'>
                        <ChartSubLabel label='Diagnoses' />
                    </div>
                </div>
                <div className='flex flex-col gap-3 border-b'>
                    <ChartLabel label='Plan' />
                    <div className='flex flex-col gap-2'>
                        <ChartSubLabel label='Diet Recommendations' />
                        <ChartSubLabel label='Instructions' />
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}

export default ChartNotes

const ChartLabel = ({ label }: { label: string }) => (
    <div className='font-semibold text-xl underline'>{label}</div>
)

const ChartSubLabel = ({ label }: { label: string }) => (
    <div className='font-medium text-lg'>{label}</div>
)
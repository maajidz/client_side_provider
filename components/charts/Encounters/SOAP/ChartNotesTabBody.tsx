import React from 'react'
import ChartNotesAccordion from './ChartNotesAccordion'
import DxCodeBody from './Dx/DxCodeBody'
import PrescriptionBody from './PrescriptionBody'
import LabsBody from './Labs/LabsBody'
import ImagesBody from './Images/ImagesBody'
import FolllowUp from './Follow-Up/FolllowUp'
import ReferralBody from './Referral/ReferralBody'

const ChartNotesTabBody = ({encounterId}: {encounterId: string}) => {

    return (
        <div className='flex flex-col gap-4 p-5'>
            <ChartNotesAccordion encounterId={encounterId}/>
            <DxCodeBody />
            <PrescriptionBody />
            <LabsBody />
            <ImagesBody />
            <FolllowUp />
            <ReferralBody />
        </div>
    )
}

export default ChartNotesTabBody
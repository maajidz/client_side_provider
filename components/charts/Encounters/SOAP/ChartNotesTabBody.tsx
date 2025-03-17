import React from 'react'
import ChartNotesAccordion from './ChartNotesAccordion'
import DxCodeBody from './Dx/DxCodeBody'
import PrescriptionBody from './Prescription/PrescriptionBody'
import LabsBody from './Labs/LabsBody'
import ImagesBody from './Images/ImagesBody'
import FolllowUp from './Follow-Up/FolllowUp'
import ReferralBody from './Referral/ReferralBody'
import { UserEncounterData } from '@/types/chartsInterface'

const ChartNotesTabBody = ({encounterId, patientDetails}: {encounterId: string, patientDetails: UserEncounterData}) => {

    return (
        <div className='flex flex-col gap-6'>
            <ChartNotesAccordion encounterId={encounterId} subjective={patientDetails.chart?.subjective ? patientDetails.chart.subjective : ''} patientDetails={patientDetails}/>
            <DxCodeBody patientDetails={patientDetails} encounterId={encounterId}/>
            <PrescriptionBody patientDetails={patientDetails} encounterId={encounterId}/>
            <LabsBody patientDetails={patientDetails}/>
            <ImagesBody patientDetails={patientDetails}/>
            <FolllowUp  patientDetails={patientDetails} encounterId={encounterId}/>
            <ReferralBody patientDetails={patientDetails} encounterId={encounterId}/>
        </div>
    )
}

export default ChartNotesTabBody
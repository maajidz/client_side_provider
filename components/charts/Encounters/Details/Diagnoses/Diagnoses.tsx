import React from 'react'
import AddDx from '../../SOAP/Dx/AddDx'
import { UserEncounterData } from '@/types/chartsInterface'
import PastDxBody from '../../SOAP/Dx/PastDxBody'

const Diagnoses = ({ patientDetails, encounterId }: { patientDetails: UserEncounterData, encounterId: string }) => {

    return (
        <div className='flex flex-col gap-3 border-b pb-3'>
            <div className='flex justify-between items-center'>
                <div>Diagnoses</div>
                <AddDx patientDetails={patientDetails} encounterId={encounterId} />
            </div>
            <PastDxBody patientDetails={patientDetails} />
        </div>
    )
}

export default Diagnoses
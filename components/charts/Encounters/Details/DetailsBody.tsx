import FormLabels from '@/components/custom_buttons/FormLabels'
import { UserEncounterData } from '@/types/chartsInterface'
import React from 'react'
import Alerts from './Alerts/alerts'
import Allergies from './Allergies/Allerggies'
import StickyNotes from './StickyNotes/StickyNotes'
import Medications from './Medications/Medications'
import Diagnoses from './Diagnoses/Diagnoses'
import Supplements from './Supplements/Supplements'
import Vaccines from './Vaccines/Vaccines'
import Injections from './Injections/Injections'
import PastMedicalHistory from './PastMedicalHistory/PastMedicalHistory'
import FamilyHistory from './FamilyHistory/FamilyHistory'
import SocialHistory from './SocialHistory/SocialHistory'
import Tasks from './Tasks/Tasks'
import Pharmacy from './Pharmacy/Pharmacy'
import Recalls from './Recalls/Recalls'
import Payers from './Payers/Payers'
import { ScrollArea } from '@radix-ui/react-scroll-area'

const DetailsBody = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    return (
        <div className='flex flex-col border w-96 p-3 h-full'>
            <div className='flex flex-col border-b py-2'>
                <div>{patientDetails.firstName} {patientDetails.lastName}</div>
                <div>
                    {patientDetails.userDetails?.gender}/ age
                </div>
                <div className='flex gap-2'>
                    <FormLabels label='ID' value={patientDetails?.id} />
                    <FormLabels label='DOB' value={patientDetails.userDetails?.dob} />
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2 border-b py-2'>
                <FormLabels label='Wt' value={`${patientDetails.userDetails?.weight} ${patientDetails.userDetails?.weightType}`} />
                <FormLabels label='Ht' value={`${patientDetails.userDetails?.height} ${patientDetails.userDetails?.heightType}`} />
                <FormLabels label='BMI' value={`${patientDetails.bmiRecords?.[0].currentBmi}`} />
                <FormLabels label='Vist type' value={patientDetails?.visit_type} />
                <FormLabels label='Mode' value={patientDetails?.mode} />
                <FormLabels label='Phone' value={`Phone`} />
            </div>
            <ScrollArea className="h-96 overflow-y-scroll">
                <div className="h-full ">
                    <div>
                        <Alerts />
                        <StickyNotes />
                        <Allergies />
                        <Medications />
                        <Diagnoses />
                        <Supplements />
                        <Vaccines />
                        <Injections />
                        <PastMedicalHistory />
                        <FamilyHistory />
                        <SocialHistory />
                        <Tasks />
                        <Recalls />
                        <Pharmacy />
                        <Payers />
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default DetailsBody
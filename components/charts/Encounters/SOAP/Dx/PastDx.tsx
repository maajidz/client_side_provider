import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { UserEncounterData } from '@/types/chartsInterface'
import PastDxBody from './PastDxBody'

const PastDx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Past Dx</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Past Diagnoses</DialogTitle>
                </DialogHeader>
                <PastDxBody patientDetails={patientDetails} />
            </DialogContent>
        </Dialog>
    )
}

export default PastDx
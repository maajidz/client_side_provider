import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { PastDiagnosesInterface, UserEncounterData } from '@/types/chartsInterface'
import { fetchDiagnoses } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import PastDxBody from './PastDxBody'

const PastDx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [prevDiagnosis, setPrevDiagnosis] = useState<PastDiagnosesInterface[]>([]);

    const fetchAndSetResponse = async () => {
        if (patientDetails.chart?.id) {
            setLoading(true);
            try {
                const response = await fetchDiagnoses({ chartId: patientDetails.chart?.id });
                if (response) {
                    setPrevDiagnosis(response);
                    console.log("Prev", prevDiagnosis)
                }
            } catch (e) {
                console.log("Error", e)
            } finally {
                setLoading(false)
            }
        }
    }

    if (loading) {
        <div>
            <LoadingButton />
        </div>
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Past Dx</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Past Diagnoses</DialogTitle>
                </DialogHeader>
                <PastDxBody />
            </DialogContent>
        </Dialog>
    )
}

export default PastDx
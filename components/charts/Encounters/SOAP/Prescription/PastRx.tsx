import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/LoadingButton'
import { FetchPrescription, UserEncounterData } from '@/types/chartsInterface'
import { getPrescriptionsData } from '@/services/chartsServices'
import SubmitButton from '@/components/custom_buttons/SubmitButton'

const PastRx = ({patientDetails}: {patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<FetchPrescription>()

    useEffect(()=>{
        const fetchAndSetResponse = async () => {
            if(patientDetails.chart?.id){
                setLoading(true)
            try {
                const data = await getPrescriptionsData({ chartId: patientDetails.chart.id });
                if (data) {
                    setResponse(data);
                }
            } catch (e) {
                console.log("Error", e);
                setLoading(false);
            } finally {
                setLoading(false);
            }
            }
        }
        fetchAndSetResponse()    
    }, [patientDetails.chart?.id])

    if(loading){
        return(
            <LoadingButton />
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Past Rx</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Prescription</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <div className="flex gap-3 p-1 border rounded-lg">
                        <div className='flex flex-col border-r p-3'>
                            <div>Patient Name</div>
                            <div>Patient ID</div>
                            <div className='flex gap-2'>
                                <div>Gender</div>
                                <div>/</div>
                                <div>DOB</div>
                            </div>
                            <div>Address</div>
                            <div>Phone No: Phoneno</div>
                            <div>Cell: cell</div>
                            <div>Vitals: weight</div>
                        </div>
                        <div className='flex flex-col p-3'>
                            <div>Provider Name</div>
                            <div>Provider ID</div>
                            <div>Facility</div>
                            <div>Address</div>
                            <div>Phone No: Phoneno</div>
                            <div>Fax: Fax</div>
                        </div>
                    </div>
                    <div className='flex flex-col p-3 rounded-lg border'>
                        <div className='flex'>
                            <div>Search & Add Rx</div>
                            <Input />
                        </div>
                        <div className='flex items-center'>
                            <div >Please search for your drug. If not found,</div>
                            <Button variant={'ghost'} className='text-[#84012A]'>Add a custom drug</Button>
                        </div>
                    </div>
                    <div className='flex flex-col p-3 rounded-lg border'>
                        <div>Past Rx</div>
                        <div className='flex items-center'>
                            {response?.prescriptions.map((prescription) => (
                                <div key={prescription.id}>
                                    <div>{prescription.drug_name}</div>
                                    <div>{prescription.directions}</div>
                                    <div>{prescription.primary_diagnosis}</div>
                                    <div>{prescription.secondary_diagnosis}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <SubmitButton label='Save Changes' />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PastRx
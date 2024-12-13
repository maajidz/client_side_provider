import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { LabOrdersDataInterface, UserEncounterData } from '@/types/chartsInterface'
import { getLabOrdersData } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'

const PastOrdersDialog = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<LabOrdersDataInterface>();

    const fetchAndSetResponse = async () => {
        setLoading(true)
        try {
            const data = await getLabOrdersData({ userDetailsId: patientDetails?.userDetails.id });
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

    if(loading){
        return(
            <div><LoadingButton /></div>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Past Orders</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Past Orders</DialogTitle>
                </DialogHeader>
                {response?.data ?
                    response?.data.map((labOrder) => (
                            <div className='flex flex-row justify-between gap-3' key={labOrder.id}>
                                <div>
                                    {labOrder.labs.map((lab) => (
                                        <div key={lab.id} >
                                            {lab.name}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {labOrder.tests.map((test) => (
                                        <div key={test.id}>
                                            {test.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) :
                    <div>No previous orders</div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default PastOrdersDialog
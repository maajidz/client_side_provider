import React, { useCallback, useEffect, useState } from 'react'
import AlertDialog from './AlertDialog'
import { UserEncounterData } from '@/types/chartsInterface'
import { deleteAlert, getAlertData } from '@/services/chartDetailsServices'
import LoadingButton from '@/components/LoadingButton'
import { AlertResponseInterface } from '@/types/alertInterface'
import FormLabels from '@/components/custom_buttons/FormLabels'
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Edit2, PlusCircle, Trash2Icon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { showToast } from '@/utils/utils'

const Alerts = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<AlertResponseInterface>();
    const [editData, setEditData] = useState<{ alertName: string; alertDescription: string; alertId: string } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAlertData({ userDetailsId: patientDetails.userDetails.id });
            if (response) {
                setData(response);
            }
        } catch (e) {
            console.log('Error', e);
        } finally {
            setLoading(false);
        }
    }, [patientDetails.userDetails.id]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts])

    const handleDeleteAlert = async (alertId: string) => {
        setLoading(true)
        try {
            await deleteAlert({ id: alertId })
            showToast({ toast, type: "success", message: `Alert deleted successfully`})
            fetchAlerts();
        } catch (e) {
            showToast({ toast, type: "error", message: `Error`})
            console.log("Error:", e)
        } finally {
            setLoading(false)
        }
    };

    if (loading) {
        return (
            <LoadingButton />
        )
    }

    return (
        <div className='flex flex-col gap-3'>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="alerts">
                    <div className='flex justify-between items-center'>
                        <AccordionTrigger >Alerts</AccordionTrigger>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditData(null);
                                setIsDialogOpen(true);
                            }}
                        >
                            <PlusCircle />
                        </Button>
                        <AlertDialog
                            userDetailsId={patientDetails.userDetails.id}
                            alertData={editData}
                            onClose={() => {
                                setIsDialogOpen(false)
                                fetchAlerts();
                            }}
                            isOpen={isDialogOpen}
                        />
                    </div>
                    <AccordionContent>
                        {data?.data && (
                            <div>
                                {data.data.flatMap((alert, index) => (
                                    <div key={index} className='flex flex-col gap-2 border p-2'>
                                        <div className='flex justify-between items-center'>
                                            <div className='text-base font-semibold'>{alert.alertType.alertName} </div>
                                            <div className='flex'>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => {
                                                        setEditData({
                                                            alertName: alert.alertType.id,
                                                            alertDescription: alert.alertDescription,
                                                            alertId: alert.id
                                                        })
                                                        setIsDialogOpen(true);
                                                    }} >
                                                    <Edit2 color='#84012A' />
                                                </Button>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => handleDeleteAlert(alert.id)}
                                                >
                                                    <Trash2Icon color='#84012A' />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1 '>
                                            <FormLabels label='Description' value={alert.alertDescription} />
                                            <FormLabels label='Notes' value={alert.alertType.notes} />
                                            <FormLabels label='Created on' value={alert.alertType.createdAt.split("T")[0]} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Alerts
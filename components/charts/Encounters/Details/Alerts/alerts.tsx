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
import { Check, Edit2, PlusCircle, Trash2Icon, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                    <div>Alert deleted successfully</div>
                </div>,
            });
            fetchAlerts();
        } catch (e) {
            console.log("Error:", e)
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>Error</div>
                </div>
            });
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
                            patientDetails={patientDetails}
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
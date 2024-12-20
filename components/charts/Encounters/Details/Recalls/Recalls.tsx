import React, { useCallback, useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/LoadingButton';
import { useToast } from '@/hooks/use-toast';
import { Check, Edit2, PlusCircle, Trash2Icon, X } from 'lucide-react';
import RecallsDialog from './RecallsDialog';
import { UserEncounterData } from '@/types/chartsInterface';
import { RecallsEditData, RecallsResponseInterface } from '@/types/recallsInterface';
import { deleteRecalls, getRecallsData } from '@/services/chartDetailsServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import FormLabels from '@/components/custom_buttons/FormLabels';
import { cn } from '@/lib/utils';

const Recalls = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<RecallsResponseInterface>();
    const [editData, setEditData] = useState<RecallsEditData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { toast } = useToast();
    const providerDetails = useSelector((state: RootState) => state.login);

    const fetchRecalls = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getRecallsData({page:1, limit:10, userDetailsId: patientDetails.userDetails.id, providerId: providerDetails.providerId });
            if (response) {
                setData(response);
            }
        } catch (e) {
            console.log('Error', e);
        } finally {
            setLoading(false);
        }
    }, [patientDetails.userDetails.id, providerDetails.providerId]);

    useEffect(() => {
        fetchRecalls();
    }, [fetchRecalls])

    const handleDeleteRecall = async (recallId: string) => {
        setLoading(true)
        try {
            await deleteRecalls({ id: recallId })
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                    <div>Recalls  deleted successfully</div>
                </div>,
            });
            fetchRecalls();
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
                <AccordionItem value="recalls">
                    <div className='flex justify-between items-center'>
                        <AccordionTrigger >Recalls</AccordionTrigger>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditData(null);
                                setIsDialogOpen(true);
                            }}
                        >
                            <PlusCircle />
                        </Button>
                        <RecallsDialog
                            patientDetails={patientDetails}
                            recallsData={editData}
                            onClose={() => {
                                setIsDialogOpen(false)
                                fetchRecalls();
                            }}
                            isOpen={isDialogOpen}
                        />
                    </div>
                    <AccordionContent>
                        {data?.data && (
                            <div>
                                {data.data.flatMap((recall, index) => (
                                    <div key={index} className='flex flex-col gap-2 border p-2'>
                                        <div className='flex justify-between items-center'>
                                            <div className='text-base font-semibold'>{recall.type} </div>
                                            <div className='flex'>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => {
                                                        setEditData({
                                                            id: recall.id,
                                                            type: recall.type,
                                                            notes: recall.notes,
                                                            providerId: recall.providerId,
                                                            due_date_period: recall.due_date_period,
                                                            due_date_value: recall.due_date_value,
                                                            due_date_unit: recall.due_date_unit,
                                                            auto_reminders: recall.auto_reminders,
                                                        })
                                                        setIsDialogOpen(true);
                                                    }} >
                                                    <Edit2 color='#84012A' />
                                                </Button>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => handleDeleteRecall(recall.id)}
                                                >
                                                    <Trash2Icon color='#84012A' />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='flex flex-wrap gap-2 '>
                                            <FormLabels label='Notes' value={recall.notes} />
                                            <FormLabels label='Auto reminders' value={recall.auto_reminders? 'On': "Off"} />
                                            <FormLabels label='Due date' value={`${recall.due_date_period} ${recall.due_date_value} ${recall.due_date_unit}`} />
                                            <FormLabels label='Created on' value={recall.createdAt.split("T")[0]} />
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

export default Recalls
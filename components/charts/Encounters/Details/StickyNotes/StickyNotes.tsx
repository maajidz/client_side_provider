import LoadingButton from '@/components/LoadingButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { deleteStickyNotes, getStickyNotesData } from '@/services/chartDetailsServices';
import { UserEncounterData } from '@/types/chartsInterface';
import { Check, Edit2, PlusCircle, Trash2Icon, X } from 'lucide-react';
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import React, { useCallback, useEffect, useState } from 'react'
import StickyNotesDialog from './StickyNotesDialog';
import { StickyNotesResponseInterface } from '@/types/stickyNotesInterface';
import FormLabels from '@/components/custom_buttons/FormLabels';

const StickyNotes = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<StickyNotesResponseInterface>();
    const [editData, setEditData] = useState<{ note: string; id: string } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const fetchStickyNotes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getStickyNotesData({ chartId: patientDetails.chart?.id });
            if (response) {
                setData(response);
            }
        } catch (e) {
            console.log('Error', e);
        } finally {
            setLoading(false);
        }
    }, [patientDetails?.chart?.id]);

    useEffect(() => {
        fetchStickyNotes();
    }, [fetchStickyNotes])

    const handleDeleteStickyNotes = async (chartId: string) => {
        setLoading(true)
        try {
            await deleteStickyNotes({ chartId: chartId })
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
            fetchStickyNotes();
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
                        <AccordionTrigger >Sticky Notes</AccordionTrigger>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditData(null);
                                setIsDialogOpen(true);
                            }}
                        >
                            <PlusCircle />
                        </Button>
                        <StickyNotesDialog
                            patientDetails={patientDetails}
                            stickyNotesData={editData}
                            onClose={() => {
                                setIsDialogOpen(false)
                                fetchStickyNotes();
                            }}
                            isOpen={isDialogOpen}
                        />
                    </div>
                    <AccordionContent>
                        {data?.data && (
                            <div>
                                {data.data.flatMap((stickyNote, index) => (
                                    <div key={index} className='flex flex-col gap-2 border p-2'>
                                        <div className='flex justify-between items-center'>
                                            <div className='text-base font-semibold'>{stickyNote.id} </div>
                                            <div className='flex'>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => {
                                                        setEditData({
                                                            note: stickyNote.note,
                                                            id: stickyNote.id
                                                        })
                                                        setIsDialogOpen(true);
                                                    }} >
                                                    <Edit2 color='#84012A' />
                                                </Button>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => handleDeleteStickyNotes(stickyNote.id)}
                                                >
                                                    <Trash2Icon color='#84012A' />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1 '>
                                            <FormLabels label='Notes' value={stickyNote.note} />
                                            <FormLabels label='Created on' value={stickyNote.createdAt.split("T")[0]} />
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

export default StickyNotes
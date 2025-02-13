import LoadingButton from '@/components/LoadingButton';
import { useToast } from '@/hooks/use-toast';
import { deleteStickyNotes, getStickyNotesData } from '@/services/chartDetailsServices';
import { UserEncounterData } from '@/types/chartsInterface';
import { Edit2, PlusCircle, Trash2Icon} from 'lucide-react';
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
import { showToast } from '@/utils/utils';

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
            showToast({ toast, type: "success", message: "Alert deleted successfully" })
            fetchStickyNotes();
        } catch (e) {
            console.log("Error:", e)
            showToast({ toast, type: "error", message: "Error" })
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
                            chartId={patientDetails?.chart?.id}
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
                            <div className='flex flex-col gap-3'>
                                {data.data.flatMap((stickyNote, index) => (
                                    <div key={index} className='flex flex-col gap-2 border rounded-lg p-2'>
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
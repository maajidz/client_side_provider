import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { UserEncounterData } from '@/types/chartsInterface'
import { StickyNotesInterface, UpdateStickyNotesInterface } from '@/types/stickyNotesInterface'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { createStickyNotes, updateStickyNotesData } from '@/services/chartDetailsServices'

const StickyNotesDialog = ({
    patientDetails, stickyNotesData, onClose, isOpen }: {
        patientDetails: UserEncounterData,
        stickyNotesData?: { note: string, id: string } | null;
        onClose: () => void;
        isOpen: boolean;
    }) => {
    const [backgroundColor, setBackgroundColor] = useState<string>("#F4F39E");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const providerDetails = useSelector((state: RootState) => state.login);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    useEffect(() => {
        if (stickyNotesData?.note && content === "") {
            setContent(stickyNotesData.note);
        }
    }, [stickyNotesData, content]);

    useEffect(() => {
        const autoSave = async () => {
            if (!content) return;

                setSaving(true);
                try {
                    if (stickyNotesData) {
                        const requestData: UpdateStickyNotesInterface = {
                            note: content,
                        };
                        const response = await updateStickyNotesData({ requestData: requestData, id: stickyNotesData.id });
                        console.log("Sticky note auto-saved:", response);
                    }
                    else {
                        const requestData: StickyNotesInterface = {
                            chartId: patientDetails.chart?.id,
                            note: content,
                            providerId: providerDetails.providerId,
                        };
                        const response = await createStickyNotes({ requestData });
                        console.log("Sticky note auto-saved:", response);
                    }
                } catch (error) {
                    console.error("Error auto-saving sticky note:", error);
                } finally {
                    setSaving(false);
                }
        };

        const timer = setTimeout(autoSave, 1000);
        return () => clearTimeout(timer);
    }, [content, patientDetails , stickyNotesData, providerDetails.providerId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-[425px] bg-[${backgroundColor ? backgroundColor : '#F4F39E'}]`}>
                <DialogHeader>
                    <DialogTitle>
                        <div className='flex gap-2'>
                            <Button variant={'outline'} className='bg-[#F4F39E] border-black' onClick={() => setBackgroundColor("#F4F39E")}>
                                <div className='h-1'></div>
                            </Button>
                            <Button variant={'outline'} className='bg-[#FFBEFF] border-black' onClick={() => setBackgroundColor("#FFBEFF")}>
                                <div className='h-1'></div>
                            </Button>
                            <Button variant={'outline'} className='bg-[#91CFFF] border-black' onClick={() => setBackgroundColor("#91CFFF")}>
                                <div className='h-1'></div>
                            </Button>
                            <Button variant={'outline'} className='bg-[#C2CF6C] border-black' onClick={() => setBackgroundColor("#C2CF6C")}>
                                <div className='h-1'></div>
                            </Button>
                            <Button variant={'outline'} className='bg-[#FF7878] border-black' onClick={() => setBackgroundColor("#FF7878")}>
                                <div className='h-1'></div>
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <Textarea
                    value={content}
                    onChange={handleContentChange}
                    autoFocus
                    placeholder='Type something...'
                    className={`border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                />
                {saving && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
                
            </DialogContent>
        </Dialog>
    )
}

export default StickyNotesDialog
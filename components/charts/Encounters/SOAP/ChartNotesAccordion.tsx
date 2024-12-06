import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input'
import FormLabels from '@/components/custom_buttons/FormLabels'
import dynamic from 'next/dynamic';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from '@/components/ui/button';
import { createSOAPChart } from '@/services/chartsServices';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
);

const ChartNotesAccordion = ({encounterId}: {encounterId: string}) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const {toast} = useToast();

    const onEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
    };

    const getHtmlOutput = () => {
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        console.log("content", content);
        return content;
    };

    const handleSaveContent = async() => {
        const subjective = getHtmlOutput();
        const requestBody = {
            subjective: subjective,
            encounterId: encounterId
        }
        try{
            await createSOAPChart({requestData: requestBody})
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                    <div>Saved!</div>
                </div>,
            });
        } catch(e){
            console.log("Error", e)
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>Error while saving</div>
                </div>
            });
        }
    }

    return (
        <Accordion type="multiple" className="w-full">
            <AccordionItem value="chiefComplaints">
                <AccordionTrigger>Chief Complaints</AccordionTrigger>
                <AccordionContent>
                    <div className='flex flex-col gap-2border rounded-lg p-2'>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={onEditorStateChange}
                        />
                        <Button onClick={handleSaveContent}>Save Content</Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vitals">
                <AccordionTrigger>Vitals</AccordionTrigger>
                <AccordionContent>
                    <div className='grid grid-cols-3 gap-2' >
                        <FormLabels
                            label='Weight'
                            value={
                                <div className='flex gap-2 items-center'>
                                    <Input /> lbs
                                    <Input /> ozs
                                </div>
                            }
                        />
                        <FormLabels
                            label='Height'
                            value={
                                <div className='flex gap-2 items-center'>
                                    <Input /> ft
                                    <Input /> inches
                                </div>
                            }
                        />
                        <FormLabels
                            label='BMI'
                            value={
                                <div >
                                    <Input />
                                </div>
                            }
                        />
                        <FormLabels
                            label='Starting Weight'
                            value={
                                <div className='flex gap-2 items-center'>
                                    <Input /> lbs
                                </div>
                            }
                        />
                        <FormLabels
                            label='Goal Weight'
                            value={
                                <div className='flex gap-2 items-center'>
                                    <Input /> lbs
                                </div>
                            }
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default ChartNotesAccordion
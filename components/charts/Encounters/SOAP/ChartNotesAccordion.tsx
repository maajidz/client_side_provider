import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import WysiwygComponent from '@/components/custom_buttons/editors/WysiwygComponent'
import { Input } from '@/components/ui/input'
import FormLabels from '@/components/custom_buttons/FormLabels'

const ChartNotesAccordion = () => {
    return (
        <Accordion type="multiple" className="w-full">
            <AccordionItem value="chiefComplaints">
                <AccordionTrigger>Chief Complaints</AccordionTrigger>
                <AccordionContent>
                    <div className='border rounded-lg p-2'>
                        <WysiwygComponent />
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
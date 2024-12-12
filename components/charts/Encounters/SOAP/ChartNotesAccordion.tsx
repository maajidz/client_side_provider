import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input'
import FormLabels from '@/components/custom_buttons/FormLabels'
import dynamic from 'next/dynamic';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from '@/components/ui/button';
import { createSOAPChart, updatePatientPhysicalStatus, updateSOAPChart } from '@/services/chartsServices';
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserEncounterData } from '@/types/chartsInterface';
import LoadingButton from '@/components/LoadingButton';

const formSchema = z.object({
    weightInLbs: z.number(),
    weightInOzs: z.number().optional(),
    heightInFt: z.number(),
    heightInInches: z.number().optional(),
    bmi: z.number(),
    startingWeight: z.number(),
    goalWeight: z.number(),
})

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
);

const ChartNotesAccordion = ({ encounterId, subjective, patientDetails }: { encounterId: string, subjective: string, patientDetails: UserEncounterData }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weightInLbs: patientDetails.userDetails?.weight ? Number(patientDetails.userDetails?.weight) : 0,
            weightInOzs: 0,
            heightInFt: patientDetails.userDetails?.height ? Number(patientDetails.userDetails?.height) : 0,
            heightInInches: 0,
            bmi: 0,
        },
    })

    useEffect(() => {
        if (subjective) {
            const blocksFromHtml = htmlToDraft(subjective);
            if (blocksFromHtml) {
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                setEditorState(EditorState.createWithContent(contentState));
            }
        }
    }, [subjective]);

    const onEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
    };

    const getHtmlOutput = () => {
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        console.log("content", content);
        return content;
    };

    const handleSaveContent = async () => {
        const subjective = getHtmlOutput();

        try {
            setLoading(true)
            if (subjective) {
                const requestBody = {
                    subjective: `${subjective}`
                }
                if (patientDetails.chart?.id) {
                    await updateSOAPChart({ requestData: requestBody, chartId: patientDetails.chart?.id })
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
                }
            } else {
                const requestBody = {
                    subjective: subjective,
                    encounterId: encounterId
                }
                await createSOAPChart({ requestData: requestBody })
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
            }
        } catch (e) {
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
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Values", values);
        try {
            setLoading(true)
            if (patientDetails.chart?.id) {
                const requestBody = {
                    objective: `Weight is ${values.weightInLbs} lbs ${values.weightInOzs} ozs. Height is ${values.heightInFt} ft ${values.heightInInches} inches. BMI is ${values.bmi}. The starting weight is ${values.startingWeight} and the goal Weight is ${values.goalWeight}`,
                }
                await updateSOAPChart({ requestData: requestBody, chartId: patientDetails.chart.id });
                await updatePatientPhysicalStatus({
                    userDetailsID: patientDetails?.userDetails?.id,
                    requestData: {
                        height: Number(values.heightInInches),
                        weight: Number(values.weightInLbs)
                    }
                })
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
            } else {
                const requestBody = {
                    subjective: '',
                    objective: `Weight is ${values.weightInLbs} lbs ${values.weightInOzs} ozs. Height is ${values.heightInFt} ft ${values.heightInInches} inches. BMI is ${values.bmi}. The starting weight is ${values.startingWeight} and the goal Weight is ${values.goalWeight}`,
                    encounterId: encounterId
                }
                await createSOAPChart({ requestData: requestBody });
                await updatePatientPhysicalStatus({
                    userDetailsID: patientDetails.userDetails.id,
                    requestData: {
                        height: Number(values.heightInInches),
                        weight: Number(values.weightInLbs)
                    }
                })
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
            }
        } catch (e) {
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
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center"><LoadingButton /></div>;
    }


    return (
        <Accordion type="multiple" className="w-full" defaultValue={["chiefComplaints", "vitals"]}>
            <AccordionItem value="chiefComplaints">
                <AccordionTrigger>Chief Complaints</AccordionTrigger>
                <AccordionContent>
                    <div className='flex flex-col gap-2 border rounded-lg p-2'>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={onEditorStateChange}
                            toolbar={{
                                options: ['inline', 'list', 'textAlign', 'link'], // Only show selected options
                                inline: {
                                    options: ['bold', 'italic', 'underline', 'strikethrough'], // Limit to basic inline styles
                                },
                                list: {
                                    options: ['unordered', 'ordered'], // Only show list options
                                },
                                textAlign: {
                                    options: ['left', 'center', 'right'], // Text alignment
                                },
                                link: {
                                    options: ['link'], // Only link option
                                },
                            }}
                        />
                        <div className='flex justify-end items-end w-full'><Button className='bg-[#84012A]' onClick={handleSaveContent}>Save Content</Button></div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vitals">
                <AccordionTrigger>Vitals</AccordionTrigger>
                <AccordionContent>
                    <div >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className='flex flex-col gap-2 border rounded-lg p-2'>
                                    <div className='flex flex-wrap gap-3'>
                                        <FormLabels
                                            label='Weight'
                                            value={
                                                <div className='flex gap-2 items-center'>
                                                    <FormField
                                                        control={form.control}
                                                        name="weightInLbs"
                                                        render={({ field }) => (
                                                            <FormItem className='flex gap-1 items-center'>
                                                                <FormControl>
                                                                    <Input placeholder="Weight" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                                </FormControl>
                                                                <FormLabel className='text-base font-normal text-center'>lbs</FormLabel>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="weightInOzs"
                                                        render={({ field }) => (
                                                            <FormItem className='flex gap-1 items-center'>
                                                                <FormControl>
                                                                    <Input placeholder="Weight" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                                </FormControl>
                                                                <FormLabel className='text-base font-normal'>ozs</FormLabel>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            }
                                        />
                                        <FormLabels
                                            label='Height'
                                            value={
                                                <div className='flex gap-2 items-center'>
                                                    <FormField
                                                        control={form.control}
                                                        name="heightInFt"
                                                        render={({ field }) => (
                                                            <FormItem className='flex gap-1 items-center'>
                                                                <FormControl>
                                                                    <Input placeholder="Height" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                                </FormControl>
                                                                <FormLabel className='text-base font-normal text-center'>ft</FormLabel>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="heightInInches"
                                                        render={({ field }) => (
                                                            <FormItem className='flex gap-1 items-center'>
                                                                <FormControl>
                                                                    <Input placeholder="Height" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                                </FormControl>
                                                                <FormLabel className='text-base font-normal'>inches</FormLabel>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            }
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bmi"
                                            render={({ field }) => (
                                                <FormItem className='flex gap-1 items-center'>
                                                    <FormLabel className='text-base font-normal'>BMI:</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="BMI" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="startingWeight"
                                            render={({ field }) => (
                                                <FormItem className='flex gap-1 items-center'>
                                                    <FormLabel className='text-base font-normal'>Starting Weight: </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Starting Wt" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="goalWeight"
                                            render={({ field }) => (
                                                <FormItem className='flex gap-1 items-center'>
                                                    <FormLabel className='text-base text-center font-normal'>Goal Weight: </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Goal Weight" {...field} className='text-base font-semibold w-32' onChange={(e) => field.onChange(Number(e.target.value))} type='number' inputMode='numeric' />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='flex justify-end items-end w-full'>
                                        <Button type='submit' className='bg-[#84012A]' onClick={handleSaveContent}>
                                            Save Content
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default ChartNotesAccordion


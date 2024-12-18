import LoadingButton from '@/components/LoadingButton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem,FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { addPastMedicalHistorySchema } from '@/schema/addPastMedicalHistorySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const PastMedicalHistory = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof addPastMedicalHistorySchema>>({
        resolver: zodResolver(addPastMedicalHistorySchema),
        defaultValues: {
            notes: "",
            glp_refill_note_practice: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof addPastMedicalHistorySchema>) => {
        console.log("Form Values:", values);
        // const requestData = {
        //     alertName: "",
        //     alertDescription: "",
        // }
        setLoading(true)
        try {
           // await createTransfer({ requestData: requestData })
        } catch (e) {
            console.log("Error:", e)
        } finally {
            setLoading(false)
        }
    };

    if(loading){
        return(
            <LoadingButton />
        )
    }
    
    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>Past Medical History</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Past Medical History</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-5'>
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel className='w-fit'>Note</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="glp_refill_note_practice"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel>GLP Refill Note Practice - PMH</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit' className='bg-[#84012A]' >Save</Button>
                            </div>

                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PastMedicalHistory
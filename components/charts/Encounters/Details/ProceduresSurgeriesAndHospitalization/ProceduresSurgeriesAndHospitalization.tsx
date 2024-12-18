import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import LoadingButton from '@/components/LoadingButton'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addProceduresSurgeriesAndHospitalizationFormSchema } from '@/schema/addProceduresSurgeriesAndHospitalizationSchma'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select'

const ProceduresSurgeriesAndHospitalization = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>>({
        resolver: zodResolver(addProceduresSurgeriesAndHospitalizationFormSchema),
        defaultValues: {
            type: "",
            name: "",
            fromDate: new Date().toISOString().split("T")[0],
            notes: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>) => {
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

    if (loading) {
        return (
            <LoadingButton />
        )
    }

    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>Procedures, Surgeries, and Hospitalization</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Procedure</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-5'>
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel className='w-fit'>Type</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="procedure">Procedure</SelectItem>
                                                        <SelectItem value="surgeries">Surgeries</SelectItem>
                                                        <SelectItem value="hospitalization">Hospitalization</SelectItem>
                                                        <SelectItem value="other_events">Other Events</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel className='w-fit'>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fromDate"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel>From Date:</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel>Notes</FormLabel>
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

export default ProceduresSurgeriesAndHospitalization
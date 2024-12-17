import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import LoadingButton from '@/components/LoadingButton'
import { Textarea } from '@/components/ui/textarea'
import { alertSchema } from '@/schema/alertSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'

const AlertDialog = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof alertSchema>>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            alertName: "",
            alertDescription: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof alertSchema>) => {
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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost"><PlusCircle /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Alert</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-5'>
                            <FormField
                                control={form.control}
                                name="alertName"
                                render={({ field }) => (
                                    <FormItem className='flex'>
                                        <FormLabel className='w-fit'>Alert Name</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose Alert from Master List" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="provider1">Provider 1</SelectItem>
                                                    <SelectItem value="provider2">Provider 2</SelectItem>
                                                    <SelectItem value="provider3">Provider 3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="alertDescription"
                                render={({ field }) => (
                                    <FormItem className='flex'>
                                        <FormLabel>Alert Description</FormLabel>
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
    )
}

export default AlertDialog
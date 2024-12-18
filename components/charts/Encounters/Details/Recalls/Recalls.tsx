import LoadingButton from '@/components/LoadingButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { recallFormSchema } from '@/schema/recallFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Recalls = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof recallFormSchema>>({
        resolver: zodResolver(recallFormSchema),
        defaultValues: {
            type: "",
            notes: "",
            dueDate: { period: "after", value: 1, unit: "weeks" },
            provider: "",
            sendAutoReminders: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof recallFormSchema>) => {
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
            <div>Recalls</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Recalls</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Asynchronous Refill Visit">Asynchronous Refill Visit</SelectItem>
                                                    <SelectItem value="Synchronous Visit">Synchronous Visit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Add notes here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="dueDate.period"
                                    render={({ field }) => (
                                        <FormItem className="w-1/3">
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="after">After</SelectItem>
                                                        <SelectItem value="before">Before</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dueDate.value"
                                    render={({ field }) => (
                                        <FormItem className="w-1/3">
                                            <FormLabel>Value</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dueDate.unit"
                                    render={({ field }) => (
                                        <FormItem className="w-1/3">
                                            <FormLabel>Unit</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="days">Days</SelectItem>
                                                        <SelectItem value="weeks">Weeks</SelectItem>
                                                        <SelectItem value="months">Months</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Provider */}
                            <FormField
                                control={form.control}
                                name="provider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provider</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Abbey Reau">Abbey Reau</SelectItem>
                                                    <SelectItem value="John Doe">John Doe</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Auto Reminders */}
                            <FormField
                                control={form.control}
                                name="sendAutoReminders"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Send Auto Reminders to Patient</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button type="submit">Add</Button>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Recalls
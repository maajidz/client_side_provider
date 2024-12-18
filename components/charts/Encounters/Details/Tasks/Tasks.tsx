import LoadingButton from '@/components/LoadingButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { tasksSchema } from '@/schema/tasksSchema'
import { RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const Tasks = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showDueDate, setShowDueDate] = useState(false);
    const providerDetails = useSelector((state: RootState) => state.login);
    const reminderOptions = ["On Due Date", "1 Day Before", "2 Days Before", "3 Days Before"];

    const form = useForm<z.infer<typeof tasksSchema>>({
        resolver: zodResolver(tasksSchema),
        defaultValues: {
            category: "",
            task: "",
            owner: providerDetails.firstName ? providerDetails.firstName : '',
            priority: "",
            dueDate: new Date().toISOString().split("T")[0],
            sendReminder: [],
            comments: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
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
            <div>Tasks</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Tasks</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-5'>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel className='w-fit'>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="category1">Category 1</SelectItem>
                                                        <SelectItem value="category2">Category 2</SelectItem>
                                                        <SelectItem value="category3">Category 3</SelectItem>
                                                        <SelectItem value="category4">Category 4</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="task"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel>Task</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="owner"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel className='w-fit'>Owner</FormLabel>
                                            <FormControl>
                                                <Input readOnly {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="High">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="assignDueDate" onCheckedChange={(checked) => setShowDueDate(checked as boolean)} />
                                    <label htmlFor="assignDueDate" className="text-sm font-medium">
                                        Assign due date
                                    </label>
                                </div>

                                {showDueDate && (
                                    <>
                                        <div className="space-y-4 border-t pt-4">
                                            <h4 className="text-lg font-semibold">Date and Reminder Settings</h4>
                                            <FormField
                                                control={form.control}
                                                name="dueDate"
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
                                                name="sendReminder"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Send Reminder Mail</FormLabel>
                                                        {reminderOptions.map((option) => (
                                                            <div key={option} className="flex items-center space-x-3">
                                                                <Checkbox
                                                                    id={option}
                                                                    checked={field.value?.includes(option)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...(field.value || []), option])
                                                                            : field.onChange(field.value?.filter((value) => value !== option));
                                                                    }}
                                                                />
                                                                <label htmlFor={option} className="text-sm font-medium">
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        ))}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                )}
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel>Comments</FormLabel>
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

export default Tasks
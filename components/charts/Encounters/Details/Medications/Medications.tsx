import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import AddMedicationBody from './AddMedicationBody'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectValue, SelectContent, SelectTrigger, SelectItem } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { addMedicationFormSchema } from '@/schema/addMedicationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import LoadingButton from '@/components/LoadingButton'
import { Input } from '@/components/ui/input'

export interface MedicationList {
    productName: string;
    tradeName: string;
    strength: string;
    route: string;
    doseForm: string;
}

const Medications = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState<MedicationList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddClick = (medication: MedicationList) => {
        setSelectedMedication(medication);
        setIsAddDialogOpen(false);
        setIsDetailsDialogOpen(true);
    };

    const form = useForm<z.infer<typeof addMedicationFormSchema>>({
        resolver: zodResolver(addMedicationFormSchema),
        defaultValues: {
            directions: "",
            fromDate: new Date().toISOString().split("T")[0],
            toDate: new Date().toISOString().split("T")[0],
            status: "Active",
        },
    });

    const onSubmit = async (values: z.infer<typeof addMedicationFormSchema>) => {
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
            <div>Medications</div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add Medications</DialogTitle>
                    </DialogHeader>
                    <AddMedicationBody
                        onAddClick={handleAddClick}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Medication</DialogTitle>
                    </DialogHeader>
                    <p>{selectedMedication?.productName} {selectedMedication?.strength} {selectedMedication?.route} {selectedMedication?.doseForm}</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-5'>
                                <FormField
                                    control={form.control}
                                    name="directions"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel>Directions</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='flex justify-between'>
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
                                        name="toDate"
                                        render={({ field }) => (
                                            <FormItem className='flex gap-2 items-center'>
                                                <FormLabel>To Date:</FormLabel>
                                                <FormControl>
                                                   <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <FormLabel className='w-fit'>Status</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose Alert from Master List" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Active</SelectItem>
                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
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

export default Medications
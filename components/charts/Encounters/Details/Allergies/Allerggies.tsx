import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { allergenFormSchema } from '@/schema/allergenFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Trash2Icon } from 'lucide-react'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const Allergies = () => {
    const form = useForm<z.infer<typeof allergenFormSchema>>({
        resolver: zodResolver(allergenFormSchema),
        defaultValues: {
            allergens: [
                { type: "", allergen: "", severity: "Severe", observedOn: "", status: "Active", reactions: "" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "allergens",
    });

    const onSubmit = (data: z.infer<typeof allergenFormSchema>) => {
        console.log("Submitted Data:", data);
    };

    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>Allergies</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <table className="w-full border-collapse border-spacing-4">
                                <thead>
                                    <tr >
                                        <td className="p-2">
                                            Type
                                        </td>
                                        <td className="p-2">
                                            Allergen
                                        </td>
                                        <td className="p-2">
                                            Severity
                                        </td>
                                        <td className="p-2">
                                            Observed On
                                        </td>
                                        <td className="p-2">
                                            Status
                                        </td>
                                        <td className="p-2">
                                            Reactions
                                        </td>
                                    </tr>
                                </thead>
                                <tbody className="space-y-2">
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="space-x-4">
                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`allergens.${index}.type`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Medication">Medication</SelectItem>
                                                                    <SelectItem value="Food">Food</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`allergens.${index}.allergen`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Enter allergen" {...field} className='w-fit' />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`allergens.${index}.severity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select severity" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Severe">Severe</SelectItem>
                                                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                                                    <SelectItem value="Mild">Mild</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`allergens.${index}.observedOn`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`allergens.${index}.status`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Active">Active</SelectItem>
                                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`allergens.${index}.reactions`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Search reactions" {...field} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            <td className="p-2">
                                                {/* Delete Button */}
                                                <Button type="button" variant="ghost" onClick={() => remove(index)}>
                                                    <Trash2Icon />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className='flex justify-between'>
                                <Button
                                    type="button"
                                    variant={'ghost'}
                                    onClick={() =>
                                        append({ type: "", allergen: "", severity: "Severe", observedOn: "", status: "Active", reactions: "" })
                                    }
                                    className='text-blue-400'
                                >
                                    Add More
                                </Button>

                                <Button type="submit" className="bg-[#84012A]">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Allergies
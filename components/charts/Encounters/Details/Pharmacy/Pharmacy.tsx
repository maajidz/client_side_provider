import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { addPharmacyFormSchema } from '@/schema/addPharmacySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Pharmacy = () => {
    const [filteredData, setFilteredData] = useState(PHARMACY_DATA);

    const form = useForm<z.infer<typeof addPharmacyFormSchema>>({
        resolver: zodResolver(addPharmacyFormSchema),
        defaultValues: {
            name: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
        },
    });

    function onSubmit(values: z.infer<typeof addPharmacyFormSchema>) {
        // Filter logic
        const filtered = PHARMACY_DATA.filter((pharmacy) => {
            return (
                (!values.name || pharmacy.name.toLowerCase().includes(values.name.toLowerCase())) &&
                (!values.city || pharmacy.address.toLowerCase().includes(values.city.toLowerCase())) &&
                (!values.state || pharmacy.address.toLowerCase().includes(values.state.toLowerCase())) &&
                (!values.zip || pharmacy.zip.includes(values.zip)) &&
                (!values.phone || pharmacy.contact.includes(values.phone))
            );
        });
        setFilteredData(filtered);
    }


    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>Pharmacy</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Add Pharmacy</DialogTitle>
                    </DialogHeader>
                    <div className="p-8">
                        {/* Search Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Search Pharmacy" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="City" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select State" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="AL">Alabama</SelectItem>
                                                        <SelectItem value="CA">California</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="zip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Zip Code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Phone Number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-end">
                                    <Button type="submit">Search</Button>
                                </div>
                            </form>
                        </Form>

                        {/* Results Table */}
                        <div className="mt-6">
                            <Table>
                                <TableCaption>List of Pharmacies</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pharmacy Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Zip Code</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.map((pharmacy, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{pharmacy.name}</TableCell>
                                            <TableCell>{pharmacy.type}</TableCell>
                                            <TableCell>{pharmacy.address}</TableCell>
                                            <TableCell>{pharmacy.contact}</TableCell>
                                            <TableCell>{pharmacy.zip}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Pharmacy

const PHARMACY_DATA = [
    { name: "Smithermans Pharmacy", type: "Retail", address: "703 Main St , Montevallo, AL", contact: "2056652574", zip: "35115" },
    { name: "McConaghy Drug Store Inc.", type: "Retail", address: "5565 Hwy 43 , Satsuma, AL", contact: "2516752070", zip: "365720488" },
    { name: "LIMESTONE DRUG", type: "Retail", address: "200 W MARKET ST , ATHENS, AL", contact: "2562323811", zip: "35611" },
    { name: "PROPST DRUG INC", type: "Retail", address: "717 PRATT AVE , HUNTSVILLE, AL", contact: "2565397443", zip: "35801" },
    { name: "Boaz Discount Pharmacy", type: "Retail", address: "10460 AL Highway 168 Ste 1 , Boaz, AL", contact: "2565936546", zip: "35957" },
  ];
"use client"

import FormLabels from '@/components/custom_buttons/FormLabels'
import { Calendar } from '@/components/ui/calendar'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, MoreHorizontal } from 'lucide-react'
import { format } from "date-fns"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import "react-quill/dist/quill.snow.css";
import WysiwygComponent from '@/components/custom_buttons/editors/WysiwygComponent'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import PageContainer from '@/components/layout/page-container'

const Encounter = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    // const [chiefComplaints, setChiefComplaints] = useState("");

    return (
        <PageContainer>
            <div className='flex flex-col gap-3 border '>
                <div className='grid grid-cols-3 gap-2 p-5 border-b pb-3'>
                    <FormLabels label='Provider' value='provider name' />
                    <FormLabels label='Date' value={
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    } />
                    <FormLabels label='Facility' value='Pomegranate' />
                    <FormLabels label='Session Duration' value='Pomegranate' />
                    <FormLabels label='Vist Type' value={
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select vist type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">Refill Wellness Vist</SelectItem>
                                    <SelectItem value="banana">Asynchronous Refill Request</SelectItem>
                                    <SelectItem value="blueberry">Dermatology Consultation</SelectItem>
                                    <SelectItem value="grapes">Fitness Counselling</SelectItem>
                                    <SelectItem value="pineapple">Follow Up Vist</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    } />
                    <FormLabels label='Reason' value='Pomegranate' />
                </div>
                <Tabs defaultValue="chartNotes" className="w-full">
                    <div className='flex  flex-row justify-between p-5'>
                        <TabsList className="grid w-[500px] grid-cols-2">
                            <TabsTrigger value="chartNotes">Chart Notes</TabsTrigger>
                            <TabsTrigger value="mu">MU</TabsTrigger>
                        </TabsList>
                        <div className='flex flex-row gap-5'>
                            <Button>Save</Button>
                            <Button variant={'outline'} className=''>Preview</Button>
                            <Button variant={'outline'} className=''>Sign</Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Print Patient Summary</DropdownMenuItem>
                                    <DropdownMenuItem>Print Chart Notes</DropdownMenuItem>
                                    <DropdownMenuItem>Import Medical History</DropdownMenuItem>
                                    <DropdownMenuItem>Import Family Histoty</DropdownMenuItem>
                                    <DropdownMenuItem>Import Social History</DropdownMenuItem>
                                    <DropdownMenuItem>Import Images</DropdownMenuItem>
                                    <DropdownMenuItem>Reports</DropdownMenuItem>
                                    <DropdownMenuItem>File For Review</DropdownMenuItem>
                                    <DropdownMenuItem>Quick Message</DropdownMenuItem>
                                    <DropdownMenuItem>Surveillance Report</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant={'outline'} className=''>Close</Button>
                        </div>
                    </div>
                    <TabsContent value="chartNotes">
                        <div className='p-5'>
                            <Accordion type="multiple" className="w-full" defaultValue={["dxCodes", "prescriptions", "labs", "images", "followUp", "referral"]}>
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
                                <AccordionItem value="dxCodes">
                                    <AccordionTrigger>Dx Codes</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                            <div>Add Dx</div>
                                            <Separator orientation="vertical" />
                                            <div>Templates</div>
                                            <Separator orientation="vertical" />
                                            <div>Past Dx</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="prescriptions">
                                    <AccordionTrigger>Prescriptions</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                            <div>Add Rx</div>
                                            <Separator orientation="vertical" />
                                            <div>Templates</div>
                                            <Separator orientation="vertical" />
                                            <div>Past Rx</div>
                                            <Separator orientation="vertical" />
                                            <div>Sign</div>
                                            <Separator orientation="vertical" />
                                            <div>Transmit</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="labs" >
                                    <AccordionTrigger>Labs</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                            <div>Search & Add</div>
                                            <Separator orientation="vertical" />
                                            <div>Add Labs</div>
                                            <Separator orientation="vertical" />
                                            <div>Templates</div>
                                            <Separator orientation="vertical" />
                                            <div>Past Orders</div>
                                            <Separator orientation="vertical" />
                                            <div>Map Dx</div>
                                            <Separator orientation="vertical" />
                                            <div>View Orders</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="images">
                                    <AccordionTrigger>Images</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                            <div>Add Images</div>
                                            <Separator orientation="vertical" />
                                            <div>Templates</div>
                                            <Separator orientation="vertical" />
                                            <div>Past Orders</div>
                                            <Separator orientation="vertical" />
                                            <div>Map Dx</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="followUp">
                                    <AccordionTrigger>Follow Up</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                            <div>Add Follow up</div>
                                            <Separator orientation="vertical" />
                                            <div>Templates</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="referral">
                                    <AccordionTrigger>Referral</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                            <div>Add Referral</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </TabsContent>
                    <TabsContent value="mu">
                        <div>MU</div>
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    )
}

export default Encounter


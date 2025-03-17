import FormLabels from '@/components/custom_buttons/FormLabels'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger,PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { RootState } from '@/store/store'
import { UserEncounterData } from '@/types/chartsInterface'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const DetailsComponent = ({patientDetails}:{patientDetails: UserEncounterData}) => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const providerDetails = useSelector((state: RootState)=> state.login)
    return (
        <div className="flex flex-row flex-wrap gap-6 p-5 border-b [&>div]:flex-col [&>div]:items-start">
            <FormLabels label='Provider' value={`${providerDetails.firstName} ${providerDetails.lastName}`} />
            <FormLabels label='Facility' value='Pomegranate' />
            <FormLabels label='Mode' value={patientDetails?.mode ? patientDetails?.mode : ""} />
            <div className="flex !flex-row gap-2 flex-1s [&>div]:flex-col [&>div]:items-start">
                <FormLabels label='Date' value={
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    " justify-start text-left text-xs font-semibold",
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
                <FormLabels label='Visit Type' className='[&>span>button>span]:text-xs [&>span>button>span]:font-semibold' value={
                    <Select>
                        <SelectTrigger>
                            <SelectValue className="" placeholder="Select visit type" defaultValue={patientDetails.visit_type}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">Refill Wellness Visit</SelectItem>
                                <SelectItem value="banana">Asynchronous Refill Request</SelectItem>
                                <SelectItem value="blueberry">Dermatology Consultation</SelectItem>
                                <SelectItem value="grapes">Fitness Counselling</SelectItem>
                                <SelectItem value="pineapple">Follow Up Visit</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                } />
            </div>
        </div>
    )
}

export default DetailsComponent
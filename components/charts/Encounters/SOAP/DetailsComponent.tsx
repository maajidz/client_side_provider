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
        <div className='grid grid-cols-3 gap-2 p-5 border-b pb-3'>
            <FormLabels label='Provider' value={`${providerDetails.firstName} ${providerDetails.lastName}`} />
            <FormLabels label='Date' value={
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                " justify-start text-left font-normal",
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
            <FormLabels label='Vist Type' value={
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select vist type" defaultValue={patientDetails.visit_type}/>
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
            <FormLabels label='Mode' value={patientDetails?.mode ? patientDetails?.mode : ""} />
        </div>
    )
}

export default DetailsComponent
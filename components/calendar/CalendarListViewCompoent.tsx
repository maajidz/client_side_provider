import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileIcon } from '@radix-ui/react-icons';

export const CalendarListViewComponent = (
    { patientName, patientID, providerName, startTime, endTime, dob, phoneNumber, vistType, lastVist }
        : { patientName: string, patientID: string, providerName: string, startTime: string, endTime: string, dob: string, phoneNumber: string, vistType: string, lastVist: string }) => {
    return (
        <div className='flex flex-col border-2 p-3'>
            <div className='flex justify-between font-semibold'>
                <div>{patientName}  [{patientID}]</div>
                <div className='flex gap-3'>
                    <div>
                        {providerName}
                    </div>
                    <div>|</div>
                    <div>{startTime} - {endTime}</div>
                </div>
            </div>
            <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                        <AvatarFallback>N/A</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-2'>
                        <LabelComponent label='Reason' value='Weight loss continue with glp' />
                        <div className='flex gap-3'>
                            <LabelComponent label='DOB' value={dob} />
                            <div className='flex gap-1 items-center'>
                                <MobileIcon fontSize={20} className='text-[#4b5563]' />
                                <span>{phoneNumber}</span>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex gap-3 items-center'>
                                <span className='font-medium text-[#4b5563]'>Status</span>
                                <Select>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder="Schedule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Schedule</SelectLabel>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="consulted">Consulted</SelectItem>
                                            <SelectItem value="noshow">No Show</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-3  justify-center items-center'>
                    <div className='flex flex-col gap-2'>
                        <LabelComponent label='Vist Type' value={vistType} />
                        <LabelComponent label='Last Vist' value={lastVist} />
                        <div className='flex gap-3 items-center'>
                            <span className='font-medium text-[#4b5563]'>Encounter</span>
                            <span> Start</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const LabelComponent = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className='flex gap-3'>
            <span className='font-medium text-[#4b5563]'>{label}</span>
            <span>{value}</span>
        </div>
    )
}
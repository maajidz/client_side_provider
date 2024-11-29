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
import { updateAppointmentStatus } from "@/services/providerAppointments";

export const CalendarListViewComponent = (
    { patientName, patientID, providerName, startTime, endTime, dob, phoneNumber, vistType, lastVist, status }
        : { patientName: string, patientID: string, providerName: string, startTime: string, endTime: string, dob: string, phoneNumber: string, vistType: string, lastVist: string, status: string }) => {

    const handleStatusChange = async (newStatus: string) => {
         console.log(newStatus)
         const requestData ={
            status: newStatus
         }
        try {
            await updateAppointmentStatus({appointmentID: patientID, requestData}); 
            console.log(`Status updated to ${newStatus} for patient ${patientName}`);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };
    return (
        <div className='flex flex-col border-2 p-3'>
            <div className='flex justify-between font-semibold'>
                <div className="text-lg font-semibold">{patientName}  <span className="text-[#444]">[{patientID}]</span>
                </div>
                <div className='flex gap-3'>
                    <div className="text-sm text-[#444] flex items-center gap-2">
                        <span>{providerName}</span>
                        <span className="text-[#555] text-base">|</span>
                        <span>{startTime} - {endTime}</span>
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-start'>
                <div className='flex gap-4 items-center'>
                    <Avatar className="w-14 h-14">
                        <AvatarImage src="https://github.com/shadcn" alt="Patient Avatar" />
                        <AvatarFallback>N/A</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-2'>
                        <LabelComponent label='Reason' value='Weight loss continue with glp' />
                        <div className="flex gap-4 items-center">
                            <LabelComponent label='DOB' value={dob} />
                            <div className='flex gap-1 items-center'>
                                <MobileIcon fontSize={20} className='text-[#4b5563]' />
                                <span>{phoneNumber}</span>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <div className="flex gap-4 items-center">
                                <span className='font-medium text-[#4b5563]'>Status</span>
                                <Select onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-fit">
                                        <SelectValue placeholder={status} />
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
                <div className='flex flex-col gap-2 justify-start items-start'>
                    <LabelComponent label='Vist Type' value={vistType} />
                    <LabelComponent label='Vist On' value={lastVist} />
                    <div className='flex gap-3 items-center'>
                        <span className='font-medium text-[#4b5563]'>Encounter</span>
                        <span> Start</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


const LabelComponent = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className='flex gap-3 text-sm'>
            <span className='font-medium text-[#4b5563]'>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}
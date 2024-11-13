// components/CalendarComponent.tsx
import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AvailabilityData, Slot } from '@/types/calendarInterface';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { deleteProviderAvaialability } from '@/services/availabilityServices';
import LoadingButton from '../LoadingButton';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Select, SelectItem, SelectValue } from '../ui/select';
import { SelectContent, SelectTrigger } from '@radix-ui/react-select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateApointmentDateFormSchema, updateApointmentDateSchema } from '@/schema/availabilitySchema';

interface EventData {
    id: string;
    title: string;
    start: Date;
    end: Date;
    backgroundColor: string;
    allDay: boolean;
    appointment: AvailabilityData;
}

const localizer = momentLocalizer(moment);

interface CalendarComponentProps {
    appointments: AvailabilityData[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
    appointments,
}) => {
    const { toast } = useToast();
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<EventData[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = React.useState<Date>();

    const defaultValues = {
        date: new Date(),
        isAvailable: true,
        notes: '',
        slots: [{ startTime: '', endTime: '' }],
    }

    const methods = useForm<UpdateApointmentDateFormSchema>({
        resolver: zodResolver(updateApointmentDateSchema),
        defaultValues
      });

    const { control, handleSubmit, register } = useForm({
       defaultValues
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'slots',
    });

    const onSubmit = () => {
        console.log("");
    };

    useEffect(() => {
        const events = appointments.flatMap((appointment) =>
            appointment.slots.map((slot) => ({
                id: appointment.id,
                title: `${new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                // title: `${new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(`1970-01-01T${slot.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                start: new Date(`${appointment.date}T${slot.startTime}`),
                end: new Date(`${appointment.date}T${slot.endTime}`),
                backgroundColor: appointment.isAvailable ? '#FFE7E7' : 'lightcoral',
                allDay: false,
                appointment: appointment
            }))
        );
        setEvents(events);
    }, [appointments]);

    const handleSelectEvent = (event: EventData) => {
        setSelectedSlot(
            {
                id: event.id,
                startTime: event.appointment.slots[0].startTime,
                endTime: event.appointment.slots[0].endTime,
                isAvailable: event.appointment.isAvailable
            }
        )
    };

    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };

    const handleNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    const handleDeleteClick = async (slotID: string) => {
        console.log(slotID)
        try {
            setLoading(true);
            const response = await deleteProviderAvaialability({ availabilityID: slotID });
            console.log(response)
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                    <div>{response.message}</div>
                </div>,
            });
        } catch (error) {
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>error</div>
                </div>
            });
            console.log(error);
            setSelectedSlot(null);
            window.location.reload();
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        <div>
            <LoadingButton />
        </div>
    }

    return (
        <div style={{ height: '80vh' }}>
            <BigCalendar
                localizer={localizer}
                events={events}
                date={currentDate}
                onNavigate={handleNavigate}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                view={currentView}
                onView={handleViewChange}
                selectable
                popup
                onSelectEvent={handleSelectEvent}
                eventPropGetter={(event) => ({
                    style: {
                        borderColor: '#84012A',
                        backgroundColor: event.backgroundColor,
                        color: '#84012A',
                    },
                })}
            />
            {selectedSlot && (
                <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Availabilty</DialogTitle>
                            <DialogDescription>
                                Modify details for your selected slot.
                            </DialogDescription>
                        </DialogHeader>
                        <FormProvider  {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                {/* Date */}
                                <FormField
                                    control={control}
                                    name='date'
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
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
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="isAvailable"
                                    render={(field) => (
                                        <FormItem>
                                            <FormLabel>Is Available</FormLabel>
                                            <Select {...field}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select availability" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Yes</SelectItem>
                                                    <SelectItem value="false">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name='notes'
                                    render={(field) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <Textarea {...field} placeholder="Enter notes for availability" className='w-96'/>
                                        </FormItem>
                                    )
                                    }
                                />

                                <FormField
                                    control={control}
                                    name='slots'
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Time Slots</FormLabel>
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-2 ">
                                                    <input {...register(`slots.${index}.startTime`)} placeholder="Start Time" className="border rounded p-2 w-32" />
                                                    <span>-</span>
                                                    <input {...register(`slots.${index}.endTime`)} placeholder="End Time" className="border rounded p-2 w-32" />
                                                    <Button type="button" onClick={() => remove(index)} className='text-[#84012A]' variant={'ghost'}>
                                                        <X />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button type="button" onClick={() => append({ startTime: '', endTime: '' })}>
                                                Add Slot
                                            </Button>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className='bg-[#84012A] text-white'>Save changes</Button>
                            </form>
                        </FormProvider>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    handleDeleteClick(selectedSlot.id)
                                }}
                                className='border-[#84012A] bg-white text-[#84012A] border-2 hover:bg-[#FFE7E7] hover:border-[#FFE7E7] w-full' >
                                Delete Availability
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default CalendarComponent;

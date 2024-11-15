// components/CalendarComponent.tsx
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateApointmentDateFormSchema, updateApointmentDateSchema } from '@/schema/availabilitySchema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoadingButton from '../LoadingButton';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import RadioButton from '../custom_buttons/radio_button/RadioButton';
import { AvailabilityData } from '@/types/calendarInterface';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as BigCalendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { deleteProviderAvaialability, updateProviderAvailabilityRequest } from '@/services/availabilityServices';
import { Calendar } from '../ui/calendar';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface EventData {
    id: string;
    title: string;
    start: Date;
    end: Date;
    backgroundColor: string;
    allDay: boolean;
    appointment: AvailabilityData;
    notes: string;
}

interface SelectedSlotData {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    notes: string;
}


const localizer = momentLocalizer(moment);

interface CalendarComponentProps {
    appointments: AvailabilityData[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
    appointments,
}) => {
    const { toast } = useToast();
    const providerID = useSelector((state: RootState) => state.login.providerId);
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<EventData[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SelectedSlotData | null>(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());

    const methods = useForm<UpdateApointmentDateFormSchema>({
        resolver: zodResolver(updateApointmentDateSchema),
        defaultValues: {
            date: new Date(),
            isAvailable: false,
            notes: '',
            slots: [{ startTime: '', endTime: '' }],
        },
    });

    const { control, register, setValue, reset } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'slots',
    });

    const onSubmit = async (data: UpdateApointmentDateFormSchema) => {
        console.log("Form Submitted:", data);
        const formValues = methods.getValues();
        console.log("Form Values", formValues);
        const requestData = {
            date: formValues.date.toISOString().split('T')[0],
            isAvailable: formValues.isAvailable,
            notes: formValues.notes,
            slots: formValues.slots
        }
        try {
            setLoading(true);
            const response = await updateProviderAvailabilityRequest({ requestData:requestData , providerId: "01ab2c92-e75d-48b5-88ff-3c701a0e8fd5" });
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

    useEffect(() => {
        const events = appointments.flatMap((appointment) =>
            appointment.slots.map((slot) => ({
                id: appointment.id,
                title: `${new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                start: new Date(`${appointment.date}T${slot.startTime}`),
                end: new Date(`${appointment.date}T${slot.endTime}`),
                backgroundColor: appointment.isAvailable ? '#FFE7E7' : 'lightcoral',
                allDay: false,
                appointment: appointment,
                notes: appointment.notes
            }))
        );
        setEvents(events);
    }, [appointments]);

    useEffect(() => {
        if (selectedSlot) {
            reset({
                date: new Date(),
                isAvailable: selectedSlot.isAvailable,
                notes: 'fgh',
                slots: [{ startTime: selectedSlot.startTime, endTime: selectedSlot.endTime }],
            });
        }
    }, [selectedSlot, reset]);

    const handleSelectEvent = (event: EventData) => {
        const slot = event.appointment.slots[0];
        setSelectedSlot(
            {
                id: event.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: event.appointment.isAvailable,
                notes: event.appointment.notes || '',
            }
        )
    };

    useEffect(() => {
        if (selectedSlot) {
            setValue("date", new Date());
            setValue("isAvailable", selectedSlot.isAvailable);
            setValue("notes", selectedSlot.notes || ""); // Set notes if available
            setValue("slots", [{ startTime: selectedSlot.startTime, endTime: selectedSlot.endTime }]);
        }
    }, [selectedSlot, setValue]);

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

    const handleAvailabilityChange = (value: string) => {
        setValue("isAvailable", value === "true" ? true : false);
    };

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
                    <DialogContent className="w-fit">
                        <DialogHeader>
                            <DialogTitle>Edit Availabilty</DialogTitle>
                            <DialogDescription>
                                Modify details for your selected slot.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="account" className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                <TabsTrigger value="delete">Delete</TabsTrigger>
                            </TabsList>
                            <TabsContent value="edit">
                                <FormProvider  {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                        <FormField
                                            control={control}
                                            name='date'
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel className='text-sm font-medium text-[#344054]'>Set new Date:</FormLabel>
                                                    <FormControl>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "justify-start text-left font-normal",
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
                                                                    onSelect={(day) => setDate(day || new Date())}
                                                                    initialFocus
                                                                    {...field}
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
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel className='text-sm font-medium text-[#344054]'>Is Available</FormLabel>
                                                    <div className="flex gap-4">
                                                        <div className='w-full'>
                                                            <RadioButton
                                                                label="Yes"
                                                                name="isAvailable"
                                                                value="true"
                                                                selectedValue={field.value.toString()}
                                                                onChange={handleAvailabilityChange}
                                                            />
                                                        </div>
                                                        <div className='w-full'>
                                                            <RadioButton
                                                                label="No"
                                                                name="isAvailable"
                                                                value="false"
                                                                selectedValue={field.value.toString()}
                                                                onChange={handleAvailabilityChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name='notes'
                                            render={(field) => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel className='text-sm font-medium text-[#344054]'>Notes</FormLabel>
                                                    <Textarea {...field} placeholder="Enter notes for availability" />
                                                </FormItem>
                                            )
                                            }
                                        />

                                        <FormField
                                            control={control}
                                            name='slots'
                                            render={() => (
                                                <FormItem className='flex flex-col gap-1'>
                                                    <FormLabel className='text-sm font-medium text-[#344054]'>Time Slots</FormLabel>
                                                    {fields.map((field, index) => (
                                                        <div key={field.id} className="flex items-center gap-2 ">
                                                            <input {...register(`slots.${index}.startTime`)} placeholder="Start Time" className="border rounded p-2 w-32" type='time' />
                                                            <span>-</span>
                                                            <input {...register(`slots.${index}.endTime`)} placeholder="End Time" className="border rounded p-2 w-32" type='time' />
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
                            </TabsContent>
                            <TabsContent value="delete">
                                <div className='flex flex-col gap-3'>
                                    <div>Are you sure you want to delete this availability slot?</div>
                                    <Button
                                        onClick={() => {
                                            handleDeleteClick(selectedSlot.id)
                                        }}
                                        className='border-[#84012A] bg-white text-[#84012A] border-2 hover:bg-[#FFE7E7] hover:border-[#FFE7E7] w-full' >
                                        Delete Availability
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default CalendarComponent;

// components/CalendarComponent.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AvailabilityData, Slot } from '@/types/calendarInterface';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { deleteProviderAvaialability } from '@/services/availabilityServices';
import LoadingButton from './LoadingButton';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
            <Calendar
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
                            <DialogTitle>Edit Appointment</DialogTitle>
                            <DialogDescription>
                                Modify details for your selected slot.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="slotTime" className="text-right">
                                    Slot Time
                                </Label>
                                <div className="col-span-3 flex flex-col">
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={selectedSlot.startTime ? selectedSlot.startTime : ''}
                                        className="mb-2"
                                    />
                                    {/* <Input
                                        id="endTime"
                                        type="time"
                                        value={selectedSlot.endTime ? selectedSlot.endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).slice(0, 5) : ''}

                                    /> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="availability" className="text-right">
                                    Availability
                                </Label>
                                <Input
                                    id="availability"
                                    value={selectedSlot.isAvailable ? 'Available' : 'Not Available'}
                                    className="col-span-3"
                                    readOnly
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">
                                    Notes
                                </Label>
                                {selectedSlot.id}
                                {/* <Textarea
                                    id="notes"
                                    value={selectedSlot.notes || ''}
                                    onChange={(e) => setSelectedSlot({
                                        ...selectedSlot,
                                        notes: e.target.value,
                                    })}
                                    className="col-span-3"
                                /> */}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    handleDeleteClick(selectedSlot.id)
                                }}
                                className='border-[#84012A] bg-white text-[#84012A] border-2 hover:bg-[#FFE7E7] hover:border-[#FFE7E7]'>
                                Delete
                            </Button>
                            <Button type="submit" className='bg-[#84012A] text-white'>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default CalendarComponent;

// components/CalendarComponent.tsx
import React, { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";
import { ProviderAppointmentsData } from "@/types/appointments";
import ViewAppointment from "./ViewAppointment";
import moment from "moment";
import "./css/big-calendar.css";

interface EventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  backgroundColor: string;
  appointment: ProviderAppointmentsData;
  reason: string;
}

const localizer = momentLocalizer(moment);

interface CalendarComponentProps {
  appointments: ProviderAppointmentsData[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  appointments,
}) => {
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedSlot, setSelectedSlot] =
    useState<Partial<ProviderAppointmentsData> | null>(null);

  useEffect(() => {
    const events = appointments.map((appointment) => ({
      id: appointment.id,
      title: `${appointment.patientName}`,
      start: new Date(
        `${appointment.dateOfAppointment}T${appointment.timeOfAppointment}`
      ),
      end: new Date(
        `${appointment.dateOfAppointment}T${appointment.endtimeOfAppointment}`
      ),
      allDay: false,
      appointment: appointment,
      backgroundColor: appointment.dateOfAppointment ? "#FFE7E7" : "lightcoral",
      reason: appointment.reason,
    }));

    setEvents(events);
  }, [appointments]);

  const handleSelectEvent = (event: EventData) => {
    setSelectedSlot({
      id: event.id,
      patientName: event.appointment.patientName,
      patientPhoneNumber: event.appointment.patientPhoneNumber,
      patientEmail: event.appointment.patientEmail,
      timeOfAppointment: event.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endtimeOfAppointment: event.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dateOfAppointment: event.appointment.dateOfAppointment,
      timeZone: event.appointment.timeZone,
      reason: event.appointment.reason || "",
      status: event.appointment.status,
      encounter: event.appointment.encounter,
      additionalText: event.appointment.additionalText,
    });
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="md:h-[calc(100vh-20rem)]">
      <BigCalendar
        localizer={localizer}
        events={events}
        date={currentDate}
        onNavigate={handleNavigate}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        view={currentView}
        onView={handleViewChange}
        className="calendar"
        selectable
        popup
        onSelectEvent={handleSelectEvent}
        eventPropGetter={() => ({
          className: "event",
          style: {},
        })}
        slotPropGetter={() => ({
          className: "slot",
        })}
        dayPropGetter={() => ({
          className: "day",
        })}
      />
      <ViewAppointment
        selectedAppointment={selectedSlot}
        setSelectedSlot={setSelectedSlot}
      />
    </div>
  );
};

export default CalendarComponent;

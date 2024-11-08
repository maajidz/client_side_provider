import React from 'react';
import { Calendar } from "@/components/ui/calendar";

const AppointmentCalendarView = ({ selectedDate, onDateChange }: {
    selectedDate: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}) => {
    // const [date, setDate] = useState<Date | undefined>(new Date());

    const todayClass = "w-full bg-[#84012A] text-white ";
    const selectedClass = "w-full bg-[#84012A] text-white rounded-2xl hover:bg-[#84012A] hover:text-white";
    const defaultClass = "w-full bg-white text-black";

    const isToday = (date: Date | undefined) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date | undefined) => {
        return date?.getTime() === (date?.getTime() || 0);
    };

    return (
        <div>
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                className="h-fit w-full lg:w-[42rem] rounded-2xl bg-white border-white shadow-lg px-6 py-4 "
                classNames={{
                    day_today: isToday(selectedDate) ? todayClass : defaultClass,
                    day_selected: isSelected(selectedDate) ? selectedClass : defaultClass,
                    month: "w-full font-bold text-base text-[#344054]",
                    head_row: "w-full",
                    row: "w-full",
                }}
            />
        </div>
    );
};

export default AppointmentCalendarView;

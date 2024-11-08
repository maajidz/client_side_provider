'use client'

import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import { Heading } from '../ui/heading'
import AppointmentCalendarView from './AppointmentCalendarView';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CalendarBody = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const router = useRouter();
    const handleClick = () => {
       router.push('/dashboard/calendar/availability')
    }

    return (
        <>
            <div className="flex items-start justify-between">
                <Heading
                    title={`Calendar`}
                    description=""
                />
                <div>
                    <Button className='bg-[#84012A]  rounded-lg px-3 py-4' onClick={
                        handleClick
                    }>
                        <div className='flex flex-row items-center gap-2'>
                            <PlusIcon />
                            <div className='hidden md:block lg:blocl'>
                                Update my availability
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
            <Separator />
            <div className='p-3'>
                <AppointmentCalendarView
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            </div>
        </>
    )
}

export default CalendarBody
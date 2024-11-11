import React from 'react';
import { format } from 'date-fns';
import { ProviderAvailability } from '@/types/calendarInterface';
import AvailabilityList from './AvailabilityList';

const ProviderAvailabilityListview = ({ selectedDate, availability }: { selectedDate: Date | undefined, availability: ProviderAvailability }) => {
    const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const filteredAvaialability = availability.data.filter(available =>
        available.date === formattedSelectedDate
    );


    return (
        <div>
            <div className='flex flex-col gap-8 w-full p-6 rounded-2xl bg-white border-white shadow-lg'>
                <div>
                        <h1 className='text-[#84012A] text-base font-semibold'>Upcoming Appointments</h1>
                </div>
                <AvailabilityList availability={filteredAvaialability} /> 
            </div>
        </div>
    )
}

export default ProviderAvailabilityListview

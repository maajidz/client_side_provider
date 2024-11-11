'use client'

import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { Heading } from '../ui/heading'
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProviderAvailability } from '@/types/calendarInterface';
import { fetchProviderAvaialability } from '@/services/availabilityServices';
import LoadingButton from '../LoadingButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CalendarBody = () => {
    const [loading, setLoading] = useState(true);
    const [providerAvailability, setProviderAvailability] = useState<ProviderAvailability | null>(null);
    const router = useRouter();
    const providerID = useSelector((state: RootState) => state.login.providerId);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    });
    const [customRange, setCustomRange] = useState(false);
    const handleClick = () => {
        router.push('/dashboard/calendar/availability')
    }

    useEffect(() => {
        const fetchAndSetResponse = async () => {
            if (date?.from && date?.to) {
                try {
                    const startDate = format(date.from, 'yyyy-MM-dd');
                    const endDate = format(date.to, 'yyyy-MM-dd');
                    const fetchedAvailabilties = await fetchProviderAvaialability({ providerID: providerID, startDate: startDate, endDate: endDate, limit: 3, page: 1 });
                    console.log("Fetched Availabilties:", fetchedAvailabilties);
                    if (fetchedAvailabilties) {
                        setProviderAvailability(fetchedAvailabilties);
                        console.log(providerAvailability)
                    }
                    setLoading(false);
                }
                catch (error) {
                    console.log(error)
                }
                finally {
                    setLoading(false)
                }
            }
        };

        fetchAndSetResponse();
    }, [date, providerID, providerAvailability]);

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <LoadingButton />
            </div>
        );
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
                <div className={cn("grid gap-2")}>
                    <Popover open={customRange} onOpenChange={setCustomRange}>
                        <PopoverTrigger asChild>
                            <div>
                                <Select
                                    onValueChange={(value) => {
                                        if (value === 'custom') {
                                            setCustomRange(true); 
                                        } else {
                                            setCustomRange(false); 
                                            const days = parseInt(value);
                                            const newDate = addDays(new Date(), days);
                                            setDate({
                                                from: newDate,
                                                to: addDays(newDate, days),
                                            });
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="0">Today</SelectItem>
                                        <SelectItem value="1">Tomorrow</SelectItem>
                                        <SelectItem value="3">In 3 days</SelectItem>
                                        <SelectItem value="7">In a week</SelectItem>
                                        <SelectItem value="14">In two week</SelectItem>
                                        <SelectItem value="30">In a month</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Separator />
                <div></div>
                {providerAvailability && providerAvailability?.total > 0 ? (
                    <div>
                        {providerAvailability.data.flatMap((da) =>
                            da.slots.map((sl) =>
                                <div className='flex flex-col' key={sl.id}>
                                    <div>
                                        {sl.id}
                                    </div>
                                    <div>
                                        {sl.startTime}
                                    </div>
                                    <div>
                                        {sl.endTime}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center justify-items-center pt-20'> Nothing to display</div>
                )}
            </div >
        </>
    )
}

export default CalendarBody
'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { ProviderAvailability } from '@/types/calendarInterface';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { fetchProviderAvaialability } from '@/services/availabilityServices';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const CalendarClient = () => {
  const [loading, setLoading] = useState(true);
  const [providerAvailability, setProviderAvailability] = useState<ProviderAvailability | null>(null);
  const router = useRouter();
  const providerID = useSelector((state: RootState) => state.login.providerId);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [customRange, setCustomRange] = useState(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const handleClick = () => {
    router.push('/dashboard/calendar/availability')
  }

  useEffect(() => {
    const fetchAndSetResponse = async () => {
      if (date?.from && date?.to) {
        try {
          const startDate = format(date.from, 'yyyy-MM-dd');
          const endDate = format(date.to, 'yyyy-MM-dd');
          const fetchedAvailabilties = await fetchProviderAvaialability({ providerID: providerID, startDate: startDate, endDate: endDate, limit: 7, page: 1 });
          console.log("Fetched Availabilties:", fetchedAvailabilties);
          if (fetchedAvailabilties) {
            setProviderAvailability(fetchedAvailabilties);
            console.log(providerAvailability)
            setTotalPages(fetchedAvailabilties.total)
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
  }, [date, providerAvailability, providerID]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
        {providerAvailability && providerAvailability?.total > 0 ? (
          <div>
            {providerAvailability.data.flatMap((da) =>
              <div key={da.id}>
                Date: {da.date}
              {da.slots.map((sl) =>
                <div className='flex flex-col' key={sl.id}>
                  <div>
                    Start Time: {sl.startTime}
                  </div>
                  <div>
                    End Time: {sl.endTime}
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center justify-items-center pt-20'> Nothing to display</div>
        )}
      </div >
      <Separator />
      {providerAvailability && (
        <DataTable
          searchKey="name"
          columns={columns()}
          data={providerAvailability.data}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}
    </>
  );
};

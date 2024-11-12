'use client';

import { Heading } from '@/components/ui/heading';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { ProviderAvailability } from '@/types/calendarInterface';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import React from 'react';
import { fetchProviderAvaialability } from '@/services/availabilityServices';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import CalendarComponent from '@/components/CalendarComponent';

export const CalendarClient = () => {
  const [loading, setLoading] = useState(false);
  const [providerAvailability, setProviderAvailability] = useState<ProviderAvailability | null>(null);
  const router = useRouter();
  const providerID = useSelector((state: RootState) => state.login.providerId);
  // const [date, setDate] = React.useState<DateRange | undefined>({
  //   from: new Date(),
  //   to: addDays(new Date(), 20),
  // });

  const handleClick = () => {
    router.push('/dashboard/calendar/availability')
  }

  const fetchAvailability = useCallback(
    async () => {
      if (providerID) {
        setLoading(true);
        try {
          // const startDate = format(date.from, 'yyyy-MM-dd');
          // const endDate = format(date.to, 'yyyy-MM-dd');
          const fetchedAvailabilties = await fetchProviderAvaialability({
            providerID, 
            startDate: '', 
            endDate: '', 
            limit: 7, 
            page: 1
          });

          console.log("Fetched Availabilties:", fetchedAvailabilties);

          if (fetchedAvailabilties) {
            setProviderAvailability(fetchedAvailabilties)
          }
        }
        catch (error) {
          console.error('Error fetching availability:', error);
        }
        finally {
          setLoading(false)
        }
      }
    }, [providerID]
  )

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);


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
      {providerAvailability && (
        <div>
          {!loading && providerAvailability && (
            <CalendarComponent
              appointments={providerAvailability?.data}
            />
          )}
        </div>
      )
      }
      {/* {providerAvailability && providerAvailability.data && (
        <div className="grid grid-cols-7 gap-2 w-full">
          {Object.keys(groupByDate(providerAvailability.data)).map((day, index) => {
            const dayAvailability = groupByDate(providerAvailability.data)[day];
            return (
              <div key={index} className="flex flex-col items-center border-2 p-3 ">
                <div className="font-semibold">{day}</div>
                <div className="mt-2 space-y-2">
                  {dayAvailability.map((slot) => (
                    <div key={slot.id}>
                      {slot.slots.map((timeSlot) => {
                        const startTime = new Date(`1970-01-01T${timeSlot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const endTime = new Date(`1970-01-01T${timeSlot.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div key={slot.id} className="flex flex-col items-center">
                            <span className="text-xs text-[#84012A]">{startTime} - {endTime}</span>
                          </div>
                        )
                      }
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )} */}
      {/* {providerAvailability  && providerAvailability.data && (
        <DataTable
          searchKey="name"
          columns={columns()}
          data={Object.values(groupByDate(providerAvailability.data))
            .flat()
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}  */}
    </>
  );
};

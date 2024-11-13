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
import CalendarComponent from '@/components/calendar/CalendarComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ListViewBody from '@/components/calendar/ListViewBody';


export const CalendarBody = () => {
  const [loading, setLoading] = useState(false);
  const [providerAvailability, setProviderAvailability] = useState<ProviderAvailability | null>(null);
  const router = useRouter();
  const providerID = useSelector((state: RootState) => state.login.providerId);

  const handleClick = () => {
    router.push('/dashboard/calendar/availability')
  }

  const fetchAvailability = useCallback(
    async () => {
      if (providerID) {
        setLoading(true);
        try {
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
      <Tabs defaultValue="listView" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listView">List View</TabsTrigger>
          <TabsTrigger value="calendarView">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="listView">
          <ListViewBody />
        </TabsContent>
        <TabsContent value="calendarView">
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
        </TabsContent>
      </Tabs>
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




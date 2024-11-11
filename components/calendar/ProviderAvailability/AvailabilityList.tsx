import React from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AvailabilityData } from '@/types/calendarInterface';

const AvailabilityList = ({ appointments }: { appointments: AvailabilityData }) => {
  return (
    <div>
      <ScrollArea className='h-44'>
        <div className='flex flex-col gap-4'>
          {appointments.date}
          {/* {appointments.slots ? (
            appointments.slots.map((appointment, index) => (
                <div>
                </div> */}
            {/* //   <AppointmentCard
            //   highlighted= {index==0 ? true : false}
            //     key={index}
            //     appointmentLink={appointment.meetingLink}
            //     appointmentId={appointment.id}
            //     appointmentHeadline={appointment.additionalText}
            //     providerName={appointment.providerName}
            //     providerDesignation={appointment.specialization}
            //     providerProfileAvatar={appointment.createdAt}
            //     appointmentDate={appointment.dateOfAppointment}
            //     appointmentBegin={appointment.timeOfAppointment}
            //     appointmentEnd={appointment.endtimeOfAppointment
            //     }
            //   /> */}
            {/* ))
          ) : (
            <div className='flex flex-col items-center justify-items-center text-center pt-12'>
              <div className='text-base font-medium'>
                No Appointmnents
              </div>
              <div className='text-[#444444] text-sm font-normal'>
                Looks like you have no appoints scheduled on this day
              </div>
            </div>
          )
          } */}
        </div>
        <ScrollBar orientation='vertical' />
      </ScrollArea>
    </div>
  )
}

export default AvailabilityList

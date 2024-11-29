import React from 'react'
import { CalendarListViewComponent } from './CalendarListViewCompoent'
import { ProviderAppointmentsData } from '@/types/appointments'

const ListViewBody = ({ appointments }: { appointments: ProviderAppointmentsData[] }) => {
  return (
    <div>
      {appointments.length > 0 ? (
          appointments.map((data) => (
            <CalendarListViewComponent
            key={data.id}
              dob='May 30, 2000'
              patientName={data.patientName}
              patientID={data.id}
              phoneNumber='9876098765'
              vistType='Weight loss'
              status={data.status}
              lastVist={data.dateOfAppointment}
              startTime={data.timeOfAppointment}
              endTime='10:00 am'
              providerName='Provider Name'
            />
          ))
      ) : (
        <div className='flex justify-center p-5'>
          No Appointments found
        </div>
      )}
    </div>
  )
}

export default ListViewBody
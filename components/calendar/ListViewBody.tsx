import React from "react";
import { CalendarListViewComponent } from "./CalendarListViewCompoent";
import { ProviderAppointmentsData } from "@/types/appointments";

const ListViewBody = ({
  appointments,
  onFetch,
}: {
  appointments: ProviderAppointmentsData[];
  onFetch: () => Promise<void>,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {appointments.length > 0 ? (
        appointments.map((data) => (
          <CalendarListViewComponent key={data.id} appointment={data} onFetch={onFetch} />
        ))
      ) : (
        <div className="flex justify-center p-5">No Appointments found</div>
      )}
    </div>
  );
};

export default ListViewBody;

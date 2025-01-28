import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import React, { useState } from "react";
import { AppointmentsDialog } from "./AppointmentsDialog";
import { PlusIcon } from "lucide-react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientAppointments = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            New Appointment
          </div>
        </DefaultButton>
        <AppointmentsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <PatientAppointmentClient userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientAppointments;

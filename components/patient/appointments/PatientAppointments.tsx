import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import React, { useState } from "react";
import { AppointmentsDialog } from "./AppointmentsDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const PatientAppointments = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            New Appointment
          </div>
        </Button>
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

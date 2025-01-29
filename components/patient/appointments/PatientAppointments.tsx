import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import React, { useState } from "react";
import { AppointmentsDialog } from "./AppointmentsDialog";
import { PlusIcon } from "lucide-react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const patientAppointmentsTab = [
  {
    value: "past",
    label: "Past",
    component: PatientAppointmentClient,
  },
  {
    value: "upcomming",
    label: "Upcomming",
    component: PatientAppointmentClient,
  },
  {
    value: "waiting_list",
    label: "Waiting List",
    component: PatientAppointmentClient,
  },
];

const PatientAppointments = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2 items-center">
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
      <Tabs defaultValue="upcomming" className="">
        <TabsList className="flex gap-3 w-full">
          {patientAppointmentsTab.map((tab) => (
            <CustomTabsTrigger value={tab.value} key={tab.value}>
              {tab.label}
            </CustomTabsTrigger>
          ))}
        </TabsList>
        {patientAppointmentsTab.map(({ value, component: Component }) => (
          <TabsContent value={value} key={value}>
            {Component ? <Component userDetailsId={userDetailsId} /> : value}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PatientAppointments;

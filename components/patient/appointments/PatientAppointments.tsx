import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AppointmentsDialog } from "./AppointmentsDialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const patientAppointmentsTab = [
  {
    value: "past",
    label: "Past",
    status: ["No Show", "Consulted"],
    component: PatientAppointmentClient,
  },
  {
    value: "upcoming",
    label: "Upcoming",
    status: ["Confirmed"],
    component: PatientAppointmentClient,
  },
  {
    value: "waiting_list",
    label: "Waiting List",
    status: ["Scheduled"],
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
          <PlusIcon />
          New Appointment
        </DefaultButton>

        <AppointmentsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <Tabs defaultValue="upcoming" className="">
        <TabsList className="flex gap-3 w-full">
          {patientAppointmentsTab.map((tab) => (
            <CustomTabsTrigger value={tab.value} key={tab.value}>
              {tab.label}
            </CustomTabsTrigger>
          ))}
        </TabsList>
        {patientAppointmentsTab.map(
          ({ value, component: Component, status }) => (
            <TabsContent value={value} key={value}>
              {Component ? (
                <Component userDetailsId={userDetailsId} status={status} />
              ) : (
                value
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
};

export default PatientAppointments;

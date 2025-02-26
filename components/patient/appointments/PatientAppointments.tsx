import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

interface PatientAppointmentTab {
  value: string;
  label: string;
  status: string[];
  component: React.ComponentType<{
    userDetailsId: string;
    status: string[];
    label: string;
  }>;
}

const patientAppointmentsTab: PatientAppointmentTab[] = [
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
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-1">
        <Tabs defaultValue="upcoming" className="flex w-full flex-col">
          <div className="flex flex-row justify-between gap-6 items-center">
            <TabsList className="flex gap-2 w-fit">
              {patientAppointmentsTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          {patientAppointmentsTab.map(
            ({ value, component: Component, status, label }) => (
              <TabsContent value={value} key={value}>
                <Component
                  userDetailsId={userDetailsId}
                  label={label}
                  status={status}
                />
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default PatientAppointments;

import { PatientAppointmentClient } from "@/components/tables/patient/patientAppointments/client";
import React, { useCallback, useEffect, useState } from "react";
import { AppointmentsDialog } from "./AppointmentsDialog";
import { PlusIcon } from "lucide-react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { fetchUserInfo } from "@/services/userServices";
import { PatientDetails } from "@/types/userInterface";
import LoadingButton from "@/components/LoadingButton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const patientAppointmentsTab = [
  {
    value: "past",
    label: "Past",
    component: PatientAppointmentClient,
  },
  { value: "upcomming", label: "Upcomming", component: PatientAppointmentClient },
  { value: "waiting_list", label: "Waiting List", component: PatientAppointmentClient },
];

const PatientAppointments = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<PatientDetails>();
  const [loading, setLoading] = useState(false);

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    const userData = await fetchUserInfo({ userDetailsId: userDetailsId });
    if (userData) {
      setResponse(userData.userDetails);
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  // if (!response) {
  //   return <div>Patient Details not fetched!</div>;
  // }

  return (
    <div className="flex flex-col gap-3">
      {response && (
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
            userData={response}
            onClose={() => {
              setIsDialogOpen(false);
            }}
            isOpen={isDialogOpen}
          />
        </div>
      )}
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

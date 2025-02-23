"use client";
import PageContainer from "@/components/layout/page-container";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { UserAppointmentInterface } from "@/types/userInterface";
import { fetchUserAppointments } from "@/services/userServices";
import { AppointmentsDialog } from "@/components/patient/appointments/AppointmentsDialog";
import { Button } from "@/components/ui/button";
import generateAppointmentPDF from "@/components/patient/appointments/generateAppointmentPdf";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

export function PatientAppointmentClient({
  userDetailsId,
  status,
  refreshTrigger
}: {
  userDetailsId: string;
  status: string[];
  refreshTrigger: number;
}) {
  const [userAppointment, setuserAppointment] = useState<
    UserAppointmentInterface[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<UserAppointmentInterface | null>(
    null
  );

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAppointments = await fetchUserAppointments({
        userDetailsId: userDetailsId,
        q: status.join(","),
      });
      if (fetchedAppointments) {
        setuserAppointment(fetchedAppointments);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, status]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, refreshTrigger]);

  const handleRowClick = (appointmentData: UserAppointmentInterface) => {
    setEditData(appointmentData);
    setIsDialogOpen(true);
  };

  const handleDialogClose= () => {
    setIsDialogOpen(false);
    setEditData(null);
    fetchAppointments();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button
          variant="link"
          className="border-[#84012A] text-[#84012A] hover:text-[#84012A]"
          onClick={() =>
            generateAppointmentPDF({ appointmentData: userAppointment })
          }
        >
          Print
        </Button>
      </div>
      {userAppointment.length > 0 ? (
          <DefaultDataTable
            columns={columns(handleRowClick)}
            data={userAppointment}
            pageNo={pageNo}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPageNo(newPage)}
          />
      ) : (
        <div className="flex flex-col justify-center items-center justify-items-center pt-20">
          User hasn&apos;t booked any appointment
        </div>
      )}
      <AppointmentsDialog
        userDetailsId={userDetailsId}
        onClose={handleDialogClose}
        appointmentsData={editData}
        isOpen={isDialogOpen}
      />
    </div>
  );
}

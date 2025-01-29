"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { UserAppointmentInterface } from "@/types/userInterface";
import { fetchUserAppointments } from "@/services/userServices";
import { AppointmentsDialog } from "@/components/patient/appointments/AppointmentsDialog";

export function PatientAppointmentClient({
  userDetailsId,
}: {
  userDetailsId: string;
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

  useEffect(() => {
    const fetchAndSetResponse = async () => {
      try {
        const fetchedAppointments = await fetchUserAppointments({
          userDetailsId: userDetailsId,
        });
        console.log("Fetched Appointments:", fetchedAppointments);
        if (fetchedAppointments) {
          setuserAppointment(fetchedAppointments);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetResponse();
  }, [userDetailsId]);

  const handleRowClick = (appointmentData: UserAppointmentInterface) => {
    setEditData(appointmentData);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      {userAppointment.length > 0 ? (
        <div className="space-y-4">
          <DataTable
            searchKey="name"
            columns={columns(handleRowClick)}
            data={userAppointment}
            pageNo={pageNo}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPageNo(newPage)}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center justify-items-center pt-20">
          User hasn&apos;t booked any appointment
        </div>
      )}
      <AppointmentsDialog
        userDetailsId={userDetailsId}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        appointmentsData={editData}
        isOpen={isDialogOpen}
      />
    </>
  );
}

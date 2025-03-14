"use client";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import { UserAppointmentInterface } from "@/types/userInterface";
import { fetchUserAppointments } from "@/services/userServices";
import { AppointmentsDialog } from "@/components/patient/appointments/AppointmentsDialog";
import { Button } from "@/components/ui/button";
import generateAppointmentPDF from "@/components/patient/appointments/generateAppointmentPdf";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Printer } from "lucide-react";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

export function PatientAppointmentClient({
  userDetailsId,
  status,
  label,
}: {
  userDetailsId: string;
  status: string[];
  label: string;
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
  }, [fetchAppointments]);

  const handleRowClick = (appointmentData: UserAppointmentInterface) => {
    setEditData(appointmentData);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditData(null);
    fetchAppointments();
  };

  return (
    <div className="flex flex-col gap-6">
      <AppointmentsDialog
        userDetailsId={userDetailsId}
        onClose={handleDialogClose}
        isOpen={isDialogOpen}
      />
      {loading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={
            <div className="flex flex-row items-center gap-3">
              <div>{label}</div>
              <Button
                variant="greyghost"
                onClick={() =>
                  generateAppointmentPDF({ appointmentData: userAppointment })
                }
              >
                <Printer />
                Print
              </Button>
            </div>
          }
          onAddClick={() => {
            setIsDialogOpen(true);
          }}
          columns={columns(handleRowClick)}
          data={userAppointment || []}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
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

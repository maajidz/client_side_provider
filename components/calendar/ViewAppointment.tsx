import { ProviderAppointmentsData } from "@/types/appointments";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { useState } from "react";

interface ViewAppointmentProps {
  selectedAppointment: Partial<ProviderAppointmentsData> | null;
  setSelectedSlot: React.Dispatch<
    React.SetStateAction<Partial<ProviderAppointmentsData> | null>
  >;
}

function ViewAppointment({
  selectedAppointment,
  setSelectedSlot,
}: ViewAppointmentProps) {
  //* Edit Dialog State
  const [editDialog, setEditDialog] = useState(false);

  const handleEditAppointment = (status: boolean) => {
    setEditDialog(status);
  };

  return (
    <>
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedSlot(null)}
        >
          <DialogContent className="w-fit">
            <div className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
              </DialogHeader>
              <div className="flex flex-row-reverse">
                <DefaultButton onClick={() => handleEditAppointment(true)}>
                  Edit
                </DefaultButton>
              </div>
              {/* /appointment Details */}
              <div className="flex justify-between w-full">
                <span className="font-semibold">Facility</span>
                <span className="text-gray-600">Pomegranate Health</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Patient</span>
                <span className="text-gray-600">
                  {selectedAppointment.patientName}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Mobile Phone</span>
                <span className="text-gray-600">
                  {selectedAppointment.patientPhoneNumber}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Appointment Mode</span>
                <span className="text-gray-600">
                  {selectedAppointment.encounter?.mode}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Date</span>
                <span className="text-gray-600">
                  {selectedAppointment.dateOfAppointment}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Time of Appointment</span>
                <span className="text-gray-600">
                  {selectedAppointment.timeOfAppointment} -{" "}
                  {selectedAppointment.endtimeOfAppointment}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Appointment Status</span>
                <span className="text-gray-600">
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Reason</span>
                <span className="text-gray-600">
                  {selectedAppointment.reason}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-semibold">Message to Patient</span>
                <span className="text-gray-600">
                  {selectedAppointment.additionalText}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Appointment Dialog */}
      <EditAppointmentDialog
        isOpen={editDialog}
        onClose={() => handleEditAppointment(false)}
        appointmentsData={selectedAppointment}
        userDetailsId={selectedAppointment?.userDetails?.id ?? ""}
      />
    </>
  );
}

export default ViewAppointment;


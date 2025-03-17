import { ProviderAppointmentsData } from "@/types/appointments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { useState } from "react";
import { LabelValueStacked } from "@/components/ui/labelvaluestacked";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

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
            <div className="flex flex-col gap-4 group relative">
              <DialogHeader className="flex flex-row justify-between">
                <DialogTitle>Appointment Details</DialogTitle>
              </DialogHeader>
              <Button className="text-gray-500 absolute right-0 top-10 text-xs invisible group-hover:visible" variant="link" onClick={() => handleEditAppointment(true)}>
                <Icon name="edit" size={16} />
                Edit
              </Button>
              {/* /appointment Details */}
              <div className="grid grid-cols-2 gap-6  ">
                <LabelValueStacked
                  label="Facility"
                  value="Pomegranate Health"
                  iconName="business"
                />
                <LabelValueStacked
                  label="Patient"
                  value={selectedAppointment.patientName}
                  iconName="person"
                />
                <LabelValueStacked
                  label="Mobile Phone"
                  value={selectedAppointment.patientPhoneNumber}
                  iconName="phone"
                />
                <LabelValueStacked
                  label="Appointment Mode"
                  value={selectedAppointment.encounter?.mode}
                  iconName="video_call"
                />
                <LabelValueStacked
                  label="Date"
                  value={selectedAppointment.dateOfAppointment}
                  iconName="calendar_today"
                />
                <LabelValueStacked
                  label="Time of Appointment"
                  value={`${selectedAppointment.timeOfAppointment} - ${selectedAppointment.endtimeOfAppointment}`}
                  iconName="access_time"
                />
                <LabelValueStacked
                  label="Appointment Status"
                  value={selectedAppointment.status}
                  iconName="check_circle"
                />
                <LabelValueStacked
                  label="Reason"
                  value={selectedAppointment.reason}
                  iconName="note"
                />
                <LabelValueStacked
                  label="Message to Patient"
                  value={selectedAppointment.additionalText}
                  iconName="message"
                />
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


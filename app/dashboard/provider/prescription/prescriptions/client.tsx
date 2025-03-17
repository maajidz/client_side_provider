import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Heading } from "@/components/ui/heading";
import { columns, PrescriptionTableInterface } from "./column";
import FilterPrescriptions from "./FilterPrescriptions";
import { useState } from "react";

const mockData: PrescriptionTableInterface[] = [
  {
    patient: "Camilla Hect",
    provider: "Dr. Zeta",
    visitType: "Consultation",
    visitDate: "2024-05-06",
    rxStatus: "Signed",
    rxDetails: "Amoxicillin 500mg",
    fromDate: "2024-05-06",
    toDate: "2024-05-11",
  },
  {
    patient: "Nigella Shodash",
    provider: "Dr. Lune",
    visitType: "Follow-up",
    visitDate: "2024-11-20",
    rxStatus: "Signed",
    rxDetails: "Ibuprofen 200mg",
    fromDate: "2024-11-20",
    toDate: "2024-11-27",
  },
  {
    patient: "Gideon Ackerman",
    provider: "Dr. O'Connor",
    visitType: "Routine Checkup",
    visitDate: "2024-10-15",
    rxStatus: "Un-Signed",
    rxDetails: "Lisinopril 10mg",
    fromDate: "2024-10-15",
    toDate: "2025-01-15",
  },
  {
    patient: "Calliope Stephanides",
    provider: "Dr. Phil",
    visitType: "Emergency",
    visitDate: "2024-12-05",
    rxStatus: "Un-Signed",
    rxDetails: "Morphine 10mg",
    fromDate: "2024-12-05",
    toDate: "2024-12-12",
  },
  {
    patient: "Michael Brown",
    provider: "Dr. Gaius",
    visitType: "Pre-surgery Consultation",
    visitDate: "2024-11-30",
    rxStatus: "Signed",
    rxDetails: "Paracetamol 500mg",
    fromDate: "2024-11-30",
    toDate: "2024-12-07",
  },
  {
    patient: "Cristabel Oct",
    provider: "Dr. Harris",
    visitType: "Routine Checkup",
    visitDate: "2024-12-01",
    rxStatus: "Un-Signed",
    rxDetails: "Metformin 500mg",
    fromDate: "2024-12-01",
    toDate: "2025-02-01",
  },
];

function PrescriptionsClient() {
  const [prescriptionData, setPrescription] = useState(mockData);

  return (
    <div className="flex flex-col gap-6">
        <FilterPrescriptions
          prescriptions={mockData}
          onFilter={setPrescription}
        />
      <DefaultDataTable
        title={
          <Heading
            title="Prescriptions"
          />
        }
        columns={columns()}
        data={prescriptionData}
        pageNo={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}

export default PrescriptionsClient;

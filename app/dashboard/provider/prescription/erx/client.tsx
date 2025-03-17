import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Heading } from "@/components/ui/heading";
import { columns, eRxTableInterface } from "./columns";

const eRxData: eRxTableInterface[] = [
  {
    patient: "John Doe",
    provider: "Dr. Smith",
    drug: "Amoxicillin",
    pharmacy: "Good Health Pharmacy",
    type: "Prescription",
    status: "Confirmed",
  },
  {
    patient: "Jane Doe",
    provider: "Dr. Johnson",
    drug: "Lisinopril",
    pharmacy: "City Pharmacy",
    type: "Prescription",
    status: "Confirmed",
  },
  {
    patient: "Alice Green",
    provider: "Dr. Brown",
    drug: "Metformin",
    pharmacy: "Greenfield Pharmacy",
    type: "Refill",
    status: "Pending",
  },
  {
    patient: "Bob White",
    provider: "Dr. Adams",
    drug: "Simvastatin",
    pharmacy: "Healthy Life Pharmacy",
    type: "Prescription",
    status: "Confirmed",
  },
  {
    patient: "Emma Klein",
    provider: "Dr. Clark",
    drug: "Atorvastatin",
    pharmacy: "Bright Future Pharmacy",
    type: "Prescription",
    status: "Pending",
  },
  {
    patient: "Charlie Black",
    provider: "Dr. Lee",
    drug: "Hydrochlorothiazide",
    pharmacy: "Wellness Pharmacy",
    type: "Prescription",
    status: "Confirmed",
  },
];

function ERxClient() {
  return (
    <div className="space-y-4">
      <DefaultDataTable
        title={
          <Heading
            title="eRx Sent"
          />
        }
        columns={columns()}
        data={eRxData}
        pageNo={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}

export default ERxClient;

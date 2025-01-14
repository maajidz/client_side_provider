"use client";

import { DataTable } from "../ui/data-table";
import { columns } from "./column";
import { DocumentsInterface } from "@/types/documentsInterface";
import FilterDocuments from "./FilterDocuments";

function DocumentsClient() {
  return (
    <>
      <div className="space-y-4">
        <FilterDocuments />
      </div>
      <DataTable
        searchKey="Documents"
        columns={columns()}
        data={mockData}
        pageNo={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </>
  );
}

export default DocumentsClient;

const mockData: DocumentsInterface[] = [
  {
    id: "DOC12345",
    patient: "John Doe",
    documentName: "Medical Report - 2025",
    date: "2025-01-10",
    internalComments: "Reviewed by Dr. Smith for accuracy.",
    reviewer: "Dr. Alice Smith",
    status: "Signed",
  },
  {
    id: "DOC67890",
    patient: "Jane Smith",
    documentName: "Surgical Consent Form",
    date: "2025-01-12",
    internalComments: "Awaiting signature from the patient.",
    reviewer: "Nurse Mary",
    status: "Un-Signed",
  },
  {
    id: "DOC11223",
    patient: "Robert Brown",
    documentName: "Discharge Summary",
    date: "2025-01-09",
    internalComments: "Ready for final review by Dr. Lee.",
    reviewer: "Dr. Brian Lee",
    status: "Signed",
  },
  {
    id: "DOC44556",
    patient: "Emily Johnson",
    documentName: "X-ray Results",
    date: "2025-01-11",
    internalComments: "Pending confirmation of results.",
    reviewer: "Radiologist Dr. White",
    status: "Un-Signed",
  },
  {
    id: "DOC78901",
    patient: "Michael Clark",
    documentName: "Follow-up Appointment Letter",
    date: "2025-01-13",
    internalComments: "Patient to be contacted for appointment scheduling.",
    reviewer: "Receptionist Laura",
    status: "Un-Signed",
  },
];


"use client";

import { Badge } from "@/components/ui/badge";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<PrescriptionDataInterface>[] => [
  {
    accessorKey: "drug_name",
    header: "Prescription",
    cell: ({ row }) => {
      const prescription: PrescriptionDataInterface = row.original;
      return (
        <div className="flex flex-col gap-1 text-[13px] font-medium cursor-pointer">
          <div className="font-semibold text-sm">{prescription.drug_name}</div>
          <div>
            {prescription.directions}
            {", "}for {prescription.days_of_supply} days
          </div>
          {/* <div>Dispense as Written: {prescription.dispense_as_written ? "Yes" : "No"}</div> */}
          {/* <div>Primary Diagnosis: {prescription.primary_diagnosis}</div> */}
          {/* <div>Secondary Diagnosis: {prescription.secondary_diagnosis}</div> */}
          <div>
            <span className="text-gray-600">Dispense:</span>{" "}
            {prescription.dispense_quantity} blisters,{" "}
            {prescription.dispense_unit}
          </div>
          <div>
            <span className="text-gray-600">Refills:</span>{" "}
            {prescription.additional_refills}
          </div>
          {/* <div>Prior Authorization: {prescription.prior_auth}</div> */}
          {/* <div>Prior Auth Decision: {prescription.prior_auth_decision}</div> */}
          <div>
            <span className="text-gray-600">Earliest Fill Date:</span>{" "}
            {new Date(prescription.earliest_fill_date).toLocaleDateString(
              "en-US"
            )}
          </div>
          <div>
            <span className="text-gray-600">Internal Comments:</span>{" "}
            {prescription.internal_comments}
          </div>
          <div>
            <span className="text-gray-600">Note to Pharmacy:</span>{" "}
            {prescription.Note_to_Pharmacy}
          </div>
          {/* <div>Created At: {new Date(prescription.createdAt).toLocaleDateString("en-US")}</div> */}
          {/* <div>Updated At: {new Date(prescription.updatedAt).toLocaleDateString("en-US")}</div> */}
        </div>
      );
    },
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => (
      <div>{new Date(row.original.fromDate).toLocaleDateString("en-US")}</div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => (
      <div>{new Date(row.original.toDate).toLocaleDateString("en-US")}</div>
    ),
  },
  {
    accessorKey: "signed",
    header: "Signed",
    cell: ({ row }) => (
      <div>{row.original.status === "completed" ? "Yes" : "No"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={`${
          row.original.status === "completed" ? "success" : "warning"
        }`}
      >
        {row.original.status}
      </Badge>
    ),
  },
];

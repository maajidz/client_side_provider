"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicationList } from "./Medications";

const AddMedicationBody = ({
  onAddClick,
}: {
  onAddClick: (medication: MedicationList) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [strengthFilter, setStrengthFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [doseFormFilter, setDoseFormFilter] = useState("all");

  const filteredMedications = medications.filter((med) => {
    return (
      med.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (strengthFilter === "all" || med.strength === strengthFilter) &&
      (routeFilter === "all" || med.route === routeFilter) &&
      (doseFormFilter === "all" || med.doseForm === doseFormFilter)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Button>Search</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={(value) => setStrengthFilter(value)}
          defaultValue=""
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Strength" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="60mg">60mg</SelectItem>
            <SelectItem value="10mg">10mg</SelectItem>
            <SelectItem value="20mg">20mg</SelectItem>
            <SelectItem value="5mg">5mg</SelectItem>
            <SelectItem value="0.1%">0.1%</SelectItem>
            <SelectItem value="15mg/5mL">15mg/5mL</SelectItem>
            <SelectItem value="bulk">Bulk</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setRouteFilter(value)}
          defaultValue=""
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Route" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="oral">Oral</SelectItem>
            <SelectItem value="topical">Topical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setDoseFormFilter(value)}
          defaultValue=""
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Dose Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
            <SelectItem value="cream">Cream</SelectItem>
            <SelectItem value="solution">Solution</SelectItem>
            <SelectItem value="powder">Powder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>Available Medications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Product Name</TableHead>
            <TableHead className="font-semibold">Trade Name</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMedications.map((med, index) => (
            <TableRow key={index}>
              <TableCell>{med.productName}</TableCell>
              <TableCell>{med.tradeName}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="link"
                  className="text-blue-500"
                  onClick={() => {
                    onAddClick(med);
                  }}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddMedicationBody;

const medications = [
  {
    productName: "Prednisone 60 milligram(s) oral tablet",
    tradeName: "predniSONE",
    strength: "60mg",
    route: "oral",
    doseForm: "tablet",
  },
  {
    productName: "predniSONE 10 mg tablet",
    tradeName: "predniSONE",
    strength: "10mg",
    route: "oral",
    doseForm: "tablet",
  },
  {
    productName: "prednisoLONE sodium phosphate 15 mg/5 mL oral solution",
    tradeName: "prednisoLONE SODIUM PHOSPHATE",
    strength: "15mg/5mL",
    route: "oral",
    doseForm: "solution",
  },
  {
    productName: "prednicarbate 0.1 % topical cream",
    tradeName: "PREDNICARBATE",
    strength: "0.1%",
    route: "topical",
    doseForm: "cream",
  },
  {
    productName: "predniSONE 20 mg tablet",
    tradeName: "predniSONE",
    strength: "20mg",
    route: "oral",
    doseForm: "tablet",
  },
  {
    productName: "predniSONE 5 mg tablet",
    tradeName: "predniSONE",
    strength: "5mg",
    route: "oral",
    doseForm: "tablet",
  },
  {
    productName: "prednisoLONE sod phos (bulk) powder",
    tradeName: "prednisoLONE SODIUM PHOSPHATE",
    strength: "bulk",
    route: "other",
    doseForm: "powder",
  },
];

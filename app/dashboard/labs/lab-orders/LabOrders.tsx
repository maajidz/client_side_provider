import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { LabOrdersInterface } from "@/types/chartsInterface";
import React, { useMemo, useState } from "react";
import { columns } from "./columns";
import FilterOrders from "./FilterOrders";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import LabOrdersDrawer from "./LabResultsDrawer";

const mockData: LabOrdersInterface[] = [
  {
    userDetailsId: "odwin2jnz 2jd2dmkd ojfsklmc",
    tests: ["Comprehensive Metabolic Panel"],
    labs: ["abcd efgh hijk"],
    orderedBy: "Dr Amber Jenkins",
    date: "23 July, 2024",
    isSigned: false,
  },
  {
    userDetailsId: "odwin5kfb 2jd2dmkd djk3bfjh",
    tests: ["Colonoscopy"],
    labs: ["abcd efgh hijk"],
    orderedBy: "Dr Amber Jenkins",
    date: "13 March, 2024",
    isSigned: true,
  },
  {
    userDetailsId: "odwn2jn2b 2jd2dmkd djk3bflc",
    tests: ["Complete Thyroid Profile"],
    labs: ["abcd efgh hijk"],
    orderedBy: "Dr Rashida Akram",
    date: "12 September, 2022",
    isSigned: true,
  },
];

function LabOrders() {
  const [labOrdersData, setLabOrdersData] =
    useState<LabOrdersInterface[]>(mockData);

  const filterByOrderedBy = useMemo(
    () => (orderedBy: string) => {
      let filteredData: LabOrdersInterface[] = [];

      if (orderedBy !== "all") {
        filteredData = mockData.filter(
          (order) => order.orderedBy === orderedBy
        );
      } else {
        filteredData = mockData;
      }

      setLabOrdersData(filteredData);
    },
    [setLabOrdersData]
  );

  const filterByStatus = useMemo(
    () => (status?: boolean) => {
      let filteredData: LabOrdersInterface[] = [];

      if (status !== undefined) {
        filteredData = mockData.filter((order) => order.isSigned === status);
      } else {
        filteredData = mockData;
      }

      setLabOrdersData(filteredData);
    },
    [setLabOrdersData]
  );

  return (
    <>
      <div className="flex items-start justify-between space-y-4">
        <Heading
          title={`Lab Orders`}
          description="A list of lab orders that were assigned to the patients"
        />
        <Dialog>
          <DialogTrigger className="flex items-center px-4 py-2 text-white bg-[#84012A] rounded-md hover:bg-[#6C011F]">
            <PlusIcon className="w-4 h-4 mr-2" />
            Lab Orders
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lab Orders</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 items-center">
                <label htmlFor="patient-search" className="font-semibold">
                  Patient:
                </label>
                <Input
                  id="patient-search"
                  type="text"
                  placeholder="Search by name or ID..."
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <FilterOrders
            orders={mockData}
            onSetFilteredByOrderedBy={filterByOrderedBy}
            onSetFilteredByStatus={filterByStatus}
          />
        </div>
        <DataTable
          searchKey="labOrders"
          columns={columns()}
          data={labOrdersData}
          pageNo={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </div>

      {/* Lab Orders Functions - Drawers   and Dialogs */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md mt-4">
        <span className="text-xl font-semibold text-gray-700">Labs</span>
        <LabOrdersDrawer />
      </div>
    </>
  );
}

export default LabOrders;


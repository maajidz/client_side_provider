import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LabOrdersDataInterface, LabOrdersData } from "@/types/chartsInterface";
import { getLabOrdersData } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

const PastOrdersDialog = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<LabOrdersDataInterface>();

  const fetchAndSetResponse = async () => {
    setLoading(true);
    try {
      const data = await getLabOrdersData({
        userDetailsId: userDetailsId,
        orderedBy: providerDetails.providerId,
      });
      if (data) {
        setResponse(data);
      }
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchAndSetResponse();
    }
  };

  if (loading) {
    return (
      <div>
        <LoadingButton />
      </div>
    );
  }

  const columns: ColumnDef<LabOrdersData, unknown>[] = [
    {
      header: "Lab Name",
      accessorKey: "labs",
      cell: ({ getValue }) => {
        const labs = getValue() as LabOrdersData["labs"];
        return (
          <div>
            {labs.map((lab) => (
              <div key={lab.id}>{lab.name}</div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Test Name",
      accessorKey: "tests",
      cell: ({ getValue }) => {
        const tests = getValue() as LabOrdersData["tests"];
        return (
          <div>
            {tests.map((test) => (
              <div key={test.id}>{test.name}</div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "tests",
      cell: ({ getValue }) => {
        const tests = getValue() as LabOrdersData["tests"];
        return (
          <div>
            {tests.map((test) => (
              <div key={test.id}>
                {formatDate(new Date(test.updatedAt), "d MMMM, yyyy")}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={fetchAndSetResponse}>
          Past Orders
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>Past Orders</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DefaultDataTable
          columns={columns}
          data={response?.data || []}
          pageNo={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PastOrdersDialog;

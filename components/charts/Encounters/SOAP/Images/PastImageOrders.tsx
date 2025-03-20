import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { getImagesOrdersData } from "@/services/chartsServices";
import { ImageOrdersResponseInterface } from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

const PastImageOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ImageOrdersResponseInterface>();

  const fetchAndSetResponse = async () => {
    setLoading(true);
    try {
      const data = await getImagesOrdersData({ userDetailsId: userDetailsId });
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

  const columns = [
    {
      header: "Image Name",
      accessorKey: "imageType.name",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      header: "Test Name",
      accessorKey: "imageTests",
      cell: (info: any) => info.getValue().map((test: any) => test.name).join(", ") || "N/A",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info: any) => info.getValue().split("T")[0],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Past Orders</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Past Orders</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {response?.data ? (
          <DefaultDataTable
            columns={columns}
            data={response.data}
            pageNo={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        ) : (
          <div>No previous orders</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PastImageOrders;

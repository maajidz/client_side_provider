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

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Past Orders</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Past Orders</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <table>
          <tr className="border font-semibold text-lg text-[#84012A]">
            <td>Image Name</td>
            <td>Test Name</td>
            <td>Created At</td>
          </tr>
          {response?.data ? (
            response?.data.map((imageData) => (
              <tr key={imageData.id} className="border p-3 my-3">
                <td>
                  <div key={imageData.imageType.id}>
                    {imageData.imageType.name}
                  </div>
                </td>
                <td>
                  {imageData.imageTests.map((test) => (
                    <div key={test.id}>{test.name}</div>
                  ))}
                </td>
                <td>{imageData.createdAt.split("T")[0]}</td>
              </tr>
            ))
          ) : (
            <div>No previous orders</div>
          )}
        </table>
      </DialogContent>
    </Dialog>
  );
};

export default PastImageOrders;

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LabOrdersDataInterface } from "@/types/chartsInterface";
import { getLabOrdersData } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
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

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={fetchAndSetResponse}>Past Orders </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Past Orders</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <table>
          <tr className="border font-semibold text-lg text-[#84012A]">
            <td>Lab Name</td>
            <td>Test Name</td>
            <td>Created At</td>
          </tr>
          {response?.data ? (
            response?.data.map((labOrder) => (
              <tr key={labOrder.id} className="border p-3 my-3">
                <td>
                  {labOrder.labs.map((lab) => (
                    <div key={lab.id}>{lab.name}</div>
                  ))}
                </td>
                <td>
                  {labOrder.tests.map((test) => (
                    <div key={test.id}>{test.name}</div>
                  ))}
                </td>
                <td>
                  {labOrder.tests.map((test) => (
                    <div key={test.id}>{test.updatedAt.split("T")[0]}</div>
                  ))}
                </td>
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

export default PastOrdersDialog;

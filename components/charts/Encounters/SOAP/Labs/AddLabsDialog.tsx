import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LabsDataResponse, Test } from "@/types/chartsInterface";
import {
  createLabOrder,
  createLabs,
  getLabsData,
} from "@/services/chartsServices";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { Icon } from "@/components/ui/icon";

const AddLabsDialog = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<LabsDataResponse>({
    data: [],
    total: 0,
  });
  const [loadingLabs, setLoadingLabs] = useState<boolean>(false);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [selectedLab, setSelectedLab] = useState<string>("");
  const [showNewLab, setShowNewLab] = useState<boolean>(false);
  const [labTestResponse, setLabTestResponse] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [newLab, setNewLab] = useState<string>("");
  const { toast } = useToast();
  const providerDetails = useSelector((state: RootState) => state.login);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAndSetResponse = async (page = 1) => {
    setLoadingLabs(true);
    try {
      const data = await getLabsData({ page, limit: 10 });
      if (data) {
        setResponse((prev) => ({
          data: [...prev.data, ...data.data],
          total: data.total,
        }));
        if (data.data.length < data.total) {
          await fetchAndSetResponse(page + 1);
        }
      }
    } catch (e) {
      console.log("Error", e);
      setLoadingLabs(false);
    } finally {
      setLoadingLabs(false);
    }
  };

  const createNewLab = async () => {
    if (newLab) {
      const requestData = {
        name: newLab,
        additionalText: "",
      };
      try {
        setLoadingLabs(true);
        await createLabs({ requestData: requestData });
        showToast({
          toast,
          type: "success",
          message: "New Lab added successfully",
        });
        setNewLab("");
        await fetchAndSetResponse(); // Refresh the labs list after adding a new lab
        setShowNewLab(false);
        setSelectedLab(""); // Reset selected lab after adding a new lab
      } catch (e) {
        showToast({ toast, type: "error", message: "Failed to add New Lab" });
        console.log("Error", e);
      } finally {
        setLoadingLabs(false);
      }
    }
  };

  const fetchLabTestsData = useCallback(
    async (labId: string) => {
      if (response && response.data) {
        const selectedLab = response.data.find((lab) => lab.id === labId);
        if (selectedLab) {
          setLabTestResponse(selectedLab.tests || []);
        } else {
          setLabTestResponse([]); // Reset tests if lab not found
        }
      }
    },
    [response]
  );

  const handleLabOrder = async () => {
    if (!selectedLab || !selectedTest) {
      console.log("Please select both lab and test.");
      return;
    }

    setLoadingOrder(true);
    const requestData = {
      userDetailsId: userDetailsId,
      orderedBy: providerDetails.providerId,
      date: new Date().toISOString().split("T")[0],
      labs: [selectedLab],
      tests: [selectedTest],
      isSigned: true,
    };
    console.log("Labs", requestData);
    try {
      await createLabOrder({ requestData });
      showToast({
        toast,
        type: "success",
        message: "Successfully placed order.",
      });
      setIsOpen(false);
    } catch (e) {
      console.log("Error", e);
      setLoadingOrder(false);
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (selectedLab) {
      fetchLabTestsData(selectedLab);
    }
  }, [selectedLab, fetchLabTestsData]);

  useEffect(() => {
    fetchAndSetResponse(); // Fetch labs when component mounts
  }, []);

  if (loadingOrder) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={() => fetchAndSetResponse(1)}>
          Add Labs
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lab Orders</DialogTitle>
          {/* <DialogDescription>
            Add lab orders to the patient.
          </DialogDescription> */}
        </DialogHeader>
        {loadingLabs ? (
          <LoadingButton />
        ) : (
          <div className="flex flex-col gap-6">
            {!showNewLab && (
            <div className="flex w-full py-0">
                <Button
                  variant={"link"}
                  onClick={() => {
                    setShowNewLab(true);
                  }}
                >
                  <Icon name="add" />
                  New Lab
                </Button>
              </div>
            )}
            {showNewLab ? (
              <div className="flex flex-col gap-6">
                <div className="flex gap-1 flex-col">
                  <label htmlFor="newLab">Add New Lab</label>
                  <Input
                    id="newLab"
                    value={newLab}
                    className="w-full"
                    onChange={(e) => setNewLab(e.target.value)}
                    placeholder="Enter lab name"
                  />
                </div>
                <div className="flex flex-row gap-2 flex-row-reverse">
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setShowNewLab(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createNewLab}>Add</Button>
                </div>
              </div>
            ) : null}
            {!showNewLab && (
              <div className="flex flex-col gap-1">
                <label>Labs</label>
                <Select
                  onValueChange={(value) => {
                    setSelectedLab(value);
                    setSelectedTest(""); // Reset selected test when lab changes
                  }}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lab" />
                  </SelectTrigger>
                  <SelectContent>
                    {response.data.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id}>
                        {lab.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedLab && !showNewLab && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label>Test</label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedTest(value);
                    }}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Select a Test"} />
                    </SelectTrigger>
                    <SelectContent>
                      {labTestResponse.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          {test.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              <Button onClick={handleLabOrder}>Order Lab</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLabsDialog;

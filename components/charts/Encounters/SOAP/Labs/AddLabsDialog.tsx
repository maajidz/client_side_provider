import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
import FormLabels from "@/components/custom_buttons/FormLabels";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

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
        await fetchAndSetResponse();
        setShowNewLab(!showNewLab);
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
          setLabTestResponse(selectedLab ? selectedLab.tests : []);
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

  if (loadingOrder) {
    <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-500 underline"
          onClick={() => fetchAndSetResponse(1)}
        >
          Add Labs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Lab Orders</DialogTitle>
          <DialogDescription>
            <div className="flex justify-between items-center">
              <div className="font-normal text-black">Choose Labs</div>
              {!showNewLab && (
                <DefaultButton
                  onClick={() => {
                    setShowNewLab(!showNewLab);
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <PlusIcon />
                    <div>New Lab</div>
                  </div>
                </DefaultButton>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        {loadingLabs ? (
          <LoadingButton />
        ) : (
          <div className="flex flex-col gap-3">
            {showNewLab ? (
              <div className="flex w-full justify-between gap-2">
                <div className="flex gap-2 w-full items-center">
                  <div className="w-36">Add New Lab</div>
                  <Input
                    value={newLab}
                    onChange={(e) => setNewLab(e.target.value)}
                    placeholder="Enter lab name"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={createNewLab}>Add</Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setShowNewLab(!showNewLab);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="grid grid-cols-4 gap-4 py-4">
              {response &&
                response.data &&
                response.data.length > 0 &&
                response.data.map((lab) => (
                  <Dialog key={lab.id}>
                    <DialogTrigger
                      key={lab.id}
                      onClick={() => setSelectedLab(lab.id)}
                    >
                      {lab.name}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book test for {lab.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center gap-3 justtify-center">
                        <FormLabels
                          label="Test"
                          value={
                            <Select
                              onValueChange={(value) => {
                                setSelectedTest(value);
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={"Select a Test"} />
                              </SelectTrigger>
                              <SelectContent>
                                {labTestResponse &&
                                  labTestResponse.length > 0 &&
                                  labTestResponse.map((test) => (
                                    <SelectItem key={test.id} value={test.id}>
                                      {test.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          }
                        />
                        <DefaultButton  onClick={handleLabOrder}>
                            Order Lab
                        </DefaultButton>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLabsDialog;

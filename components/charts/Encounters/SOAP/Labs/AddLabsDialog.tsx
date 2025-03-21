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

const AddLabsDialog = ({ userDetailsId, signed }: { userDetailsId: string; signed: boolean }) => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAndSetResponse = useCallback(
    async (page = 1) => {
      setLoadingLabs(true);

      try {
        const data = await getLabsData({ page, limit: 10, search: searchTerm });

        if (data) {
          setResponse((prev) => ({
            data: [...(prev?.data || []), ...data.data],
            total: data.total,
          }));

          if (data.data.length > 0 && data.data.length < data.total) {
            await fetchAndSetResponse(page + 1);
          }
        }
      } catch (e) {
        console.error("Error fetching labs:", e);
      } finally {
        setLoadingLabs(false);
      }
    },
    [searchTerm]
  );

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
    } catch (e) {
      console.log("Error", e);
    } finally {
      setSelectedLab("");
      setSelectedTest("");
      setSearchTerm("");
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (selectedLab) {
      fetchLabTestsData(selectedLab);
    }
  }, [selectedLab, fetchLabTestsData]);

  // Filter Labs
  const filteredLabs = response.data.filter((lab) =>
    `${lab.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={() => fetchAndSetResponse(1)} disabled={signed}>
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
                <div className="flex gap-2 flex-row-reverse">
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
                <div className="relative">
                  <div className="flex gap-2 border pr-2 rounded-md items-baseline">
                    <Input
                      placeholder="Search Labs"
                      value={searchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchTerm(value);
                        setVisibleSearchList(true);
                      }}
                      className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                    />
                  </div>
                  {searchTerm && visibleSearchList && (
                    <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg w-full z-[100]">
                      {loadingLabs ? (
                        <div>Loading... </div>
                      ) : filteredLabs.length > 0 ? (
                        filteredLabs.map((lab) => (
                          <div
                            key={lab.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setSearchTerm(lab.name);
                              setVisibleSearchList(false);
                              setSelectedLab(lab.id);
                            }}
                          >
                            {lab.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                <Button onClick={handleLabOrder} disabled={loadingOrder}>
                  Order Lab
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLabsDialog;

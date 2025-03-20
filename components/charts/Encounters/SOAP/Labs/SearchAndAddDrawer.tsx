import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LabsDataResponse, Test } from "@/types/chartsInterface";
import { createLabOrder, getLabsData } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { Button } from "@/components/ui/button";

const SearchAndAddDialog = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<LabsDataResponse>({
    data: [],
    total: 0,
  });
  const [labTestResponse, setLabTestResponse] = useState<Test[]>([]);
  const [loadingLabs, setLoadingLabs] = useState<boolean>(false);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [selectedLab, setSelectedLab] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<string>("");
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State for dialog open/close

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
        message: "Order placed successfully",
      });
      setSelectedLab("");
      setSelectedTest("");
    } catch (e) {
      console.log("Error", e);
      setLoadingOrder(false);
      showToast({ toast, type: "error", message: "Error!" });
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
    return <LoadingButton />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={() => fetchAndSetResponse(1)}>
          Search & Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search & Add Labs</DialogTitle>
        </DialogHeader>
        {loadingLabs ? (
          <LoadingButton />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label>Labs</label>
              <Select
                onValueChange={(value) => setSelectedLab(value)}
                defaultValue={selectedLab}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a lab" />
                </SelectTrigger>
                <SelectContent>
                  {response &&
                    response.data &&
                    response.data.length > 0 &&
                    response.data.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id}>
                        {lab.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedLab && (
              <div className="flex flex-col gap-1">
                <label>Test</label>
                <Select
                  onValueChange={(value) => {
                    setSelectedTest(value);
                  }}
                >
                  <SelectTrigger>
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
              </div>
            )}
            <Button onClick={handleLabOrder}>Order Lab</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchAndAddDialog;
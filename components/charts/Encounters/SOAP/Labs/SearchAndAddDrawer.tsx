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
import { Input } from "@/components/ui/input";

const SearchAndAddDialog = ({
  userDetailsId,
  signed,
}: {
  userDetailsId: string;
  signed: boolean;
}) => {
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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState(false);

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
    try {
      await createLabOrder({ requestData });
      showToast({
        toast,
        type: "success",
        message: "Order placed successfully",
      });
    } catch (e) {
      console.log("Error", e);
      setLoadingOrder(false);
      showToast({ toast, type: "error", message: "Error!" });
    } finally {
      setIsDialogOpen(false);
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

  if (loadingOrder) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={() => fetchAndSetResponse(1)} disabled={signed}>
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

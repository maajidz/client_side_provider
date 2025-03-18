import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import {
  CreateDiagnosesRequestBody,
  DiagnosesTypeData,
  UserEncounterData,
} from "@/types/chartsInterface";
import { useToast } from "@/hooks/use-toast";
import {
  createDiagnoses,
  createSOAPChart,
  fetchDiagnosesType,
  updateSOAPChart,
} from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingButton from "@/components/LoadingButton";

const AddDx = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [diagnosesTypeData, setDiagnosesTypeData] = useState<
    DiagnosesTypeData[]
  >([]);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  // Loading State
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [rows, setRows] = useState([
    { diagnosis_Id: "", ICD_Code: "", notes: "" },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { diagnosis_Id: "", ICD_Code: "", notes: "" }]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleChange = (index: number, field: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchDiagnosesType({
        search: searchTerm,
        page: 1,
        limit: 10,
      });

      if (response) {
        setDiagnosesTypeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching diagnoses data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
        setIsListVisible(true);
      } else {
        setDiagnosesTypeData([]);
        setIsListVisible(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, handleSearch]);

  const handleSubmit = async () => {
    try {
      if (patientDetails.chart?.id) {
        const chartId = patientDetails.chart?.id;
        const requestData: CreateDiagnosesRequestBody = {
          userDetailsId: patientDetails.userDetails.userDetailsId,
          providerId: providerDetails.providerId,
          diagnoses: rows.map((row) => ({
            ...row,
            chartId,
          })),
        };
        await createDiagnoses({ requestData: requestData });
        const data = {
          subjective: "",
          assessment: `Diagnoses: ${JSON.stringify(rows)} `,
          encounterId: encounterId,
        };
        await updateSOAPChart({ requestData: data, chartId });
        showToast({ toast, type: "success", message: "Saved!" });
      } else {
        const data = {
          subjective: "",
          assessment: `Diagnoses: ${JSON.stringify(rows)} `,
          encounterId: encounterId,
        };
        const response = await createSOAPChart({ requestData: data });
        if (response) {
          const chartId = response.id;
          const requestData: CreateDiagnosesRequestBody = {
            userDetailsId: patientDetails.userDetails.userDetailsId,
            providerId: providerDetails.providerId,
            diagnoses: rows.map((row) => ({
              ...row,
              diagnosis_Id: row.diagnosis_Id,
              notes: row.notes,
              chartId,
            })),
          };
          await createDiagnoses({ requestData: requestData });
          showToast({ toast, type: "success", message: "Saved!" });
          setIsDialogOpen(false);
        }
      }
    } catch (e) {
      showToast({ toast, type: "error", message: "Error while saving" });
      console.log("Error", e);
    } finally {
      setRows([{ diagnosis_Id: "", ICD_Code: "", notes: "" }]);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Add Dx</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Diagnoses</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            {rows.map((row, index) => (
              <div className="flex gap-2" key={index}>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter Diagnosis"
                    value={
                      diagnosesTypeData.find((d) => d.id === row.diagnosis_Id)
                        ?.diagnosis_name || searchTerm
                    }
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsListVisible(true);
                    }}
                  />

                  {loading && <LoadingButton />}
                  {isListVisible && (
                    <div className="absolute bg-white border border-gray-200 text-sm font-medium mt-1 rounded shadow-md w-full">
                      {diagnosesTypeData.map((diagnosis) => (
                        <div
                          key={diagnosis.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleChange(index, "diagnosis_Id", diagnosis.id);
                            handleChange(index, "ICD_Code", diagnosis.ICD_Code);
                            setSearchTerm(diagnosis.diagnosis_name);
                            setIsListVisible(false);
                          }}
                        >
                          {diagnosis.diagnosis_name} ({diagnosis.ICD_Code})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="ICD Codes"
                  value={row.ICD_Code}
                  onChange={(e) =>
                    handleChange(index, "ICD_Code", e.target.value)
                  }
                />
                <Input
                  type="text"
                  placeholder="Notes"
                  value={row.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                />
                <Button
                  variant={"ghost"}
                  onClick={() => handleDeleteRow(index)}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between gap-2 w-full">
            <Button variant={"ghost"} onClick={handleAddRow} className="w-full">
              {" "}
              Add Row
            </Button>
            <SubmitButton
              label="Save Changes"
              disabled={rows[0].diagnosis_Id == "" ? true : false}
              onClick={handleSubmit}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDx;

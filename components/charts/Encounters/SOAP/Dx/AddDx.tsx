import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
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
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import DropdownList from "@/components/ui/DropdownList";
import { Icon } from "@/components/ui/icon";
import { TrashIcon } from "lucide-react";

// Debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const AddDx = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);

  const [diagnosisName, setDiagnosisName] = useState<string[]>([]);
  const [diagnosesTypeData, setDiagnosesTypeData] = useState<DiagnosesTypeData[]>([]);
  const [isListVisible, setIsListVisible] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [rows, setRows] = useState([{ diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" }]);

  // Track the active input index
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the active input after any state change that might cause a re-render
  useEffect(() => {
    if (activeInputIndex !== null && inputRefs.current[activeInputIndex]) {
      // Use a small timeout to ensure the DOM has settled
      const timeoutId = setTimeout(() => {
        inputRefs.current[activeInputIndex]?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [activeInputIndex, rows, isListVisible]);

  // Function to reset rows to include one empty row
  const resetRows = () => {
    setRows([{ diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" }]);
  };

  // Handle dialog open change
  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      resetRows(); // Reset rows when dialog opens
    }
    setIsDialogOpen(open);
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleChange = useCallback((index: number, field: string, value: string) => {
    setRows(prevRows =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }, []);

  const handleSearch = useCallback(
    debounce(async (searchTerm: string, index: number) => {
      console.log(`Searching for ${searchTerm} in row ${index}`);
      if (searchTerm.length < 2) {
        setIsListVisible((prev) => {
          const newListVisible = [...prev];
          newListVisible[index] = false;
          return newListVisible;
        });
        return;
      }

      setLoading(true);
      try {
        const response = await fetchDiagnosesType({
          search: searchTerm,
          page: 1,
          limit: 10,
        });

        if (response) {
          setDiagnosesTypeData(response.data);
          setIsListVisible((prev) => {
            const newListVisible = [...prev];
            newListVisible[index] = true;
            return newListVisible;
          });
        } else {
          setDiagnosesTypeData([]);
        }
      } catch (error) {
        console.error("Error fetching diagnoses data:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSelectDiagnosis = (diagnosis: DiagnosesTypeData, index: number) => {
    handleChange(index, "diagnosis_Id", diagnosis.id);
    handleChange(index, "ICD_Code", diagnosis.ICD_Code);
    handleChange(index, "searchTerm", diagnosis.diagnosis_name);
    setIsListVisible((prev) => {
      const newListVisible = [...prev];
      newListVisible[index] = false;
      return newListVisible;
    });
    setDiagnosisName((name) => [...name, diagnosis.diagnosis_name]);

    // Add a new row and focus the input of the new row
    handleAddRow();
    setActiveInputIndex(rows.length); // Set the new row as active
  };

  const handleClearRow = (index: number) => {
    // Clear the inputs for the specified row
    handleChange(index, "diagnosis_Id", "");
    handleChange(index, "ICD_Code", "");
    handleChange(index, "notes", "");
    handleChange(index, "searchTerm", "");
  };

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
          assessment: `Diagnoses: ${diagnosisName
            .map((name) => name)
            .join(", ")}`,
          encounterId: encounterId,
        };
        await updateSOAPChart({ requestData: data, chartId });
        showToast({ toast, type: "success", message: "Saved!" });
      } else {
        const data = {
          subjective: "",
          assessment: `Diagnoses: ${diagnosisName
            .map((name) => name)
            .join(", ")} `,
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
      setRows([{ diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" }]);
      setIsDialogOpen(false);
    }
  };


  const columns = useMemo(() => [
    {
      accessorKey: "diagnosis",
      header: "Diagnosis",
      cell: ({ row }: { row: any }) => (
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Enter Diagnosis"
            value={
              diagnosesTypeData.find((d) => d.id === row.original.diagnosis_Id)
                ?.diagnosis_name || row.original.searchTerm
            }
            onChange={(e) => {
              const value = e.target.value;
              handleChange(row.index, "searchTerm", value);
              if (value.length >= 2) {
                handleSearch(value, row.index);
              } else {
                setIsListVisible((prev) => {
                  const newListVisible = [...prev];
                  newListVisible[row.index] = false;
                  return newListVisible;
                });
              }
            }}
            className="border rounded"
            ref={(el) => {
              inputRefs.current[row.index] = el;
            }}
            onFocus={() => {
              setActiveInputIndex(row.index);
            }}
          />
          {row.original.searchTerm && (
            <Button
              variant={"link"}
              size={"icon"}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => handleClearRow(row.index)}
            >
              <Icon name="close"/>
            </Button>
          )}
          {isListVisible[row.index] && (
            <DropdownList
              items={diagnosesTypeData}
              renderItem={(diagnosis) => (
                <div>
                  {diagnosis.diagnosis_name} ({diagnosis.ICD_Code})
                </div>
              )}
              onSelect={(diagnosis) => handleSelectDiagnosis(diagnosis, row.index)}
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: "ICD_Code",
      header: "ICD Codes",
      cell: ({ row }: { row: any }) => (
        <Input
          type="text"
          placeholder="ICD Codes"
          disabled
          value={row.original.ICD_Code}
          onChange={(e) => handleChange(row.index, "ICD_Code", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }: { row: any }) => (
        <Input
          type="text"
          placeholder="Notes"
          value={row.original.notes}
          onChange={(e) => handleChange(row.index, "notes", e.target.value)}
          className="border rounded"
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => handleDeleteRow(row.index)}
          disabled={rows.length === 1}
        >
          <Icon name="remove"/>
        </Button>
      ),
    },
  ], [diagnosesTypeData, isListVisible, handleSearch]); 
  

  const tableData = useMemo(() => rows, [rows]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Add Dx</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Diagnoses</DialogTitle>
          {/* <DialogDescription>Add a new diagnosis to the patient's chart.</DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-visible">
          <DefaultDataTable
            columns={columns}
            data={tableData}
            pageNo={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        </div>
        <DialogFooter>
          <div className="flex flex-row-reverse">
            <Button
              disabled={rows.length === 0 || rows[0].diagnosis_Id === ""}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDx;
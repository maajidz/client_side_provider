import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreateDiagnosesRequestBody,
  DiagnosesTypeData,
} from "@/types/chartsInterface";
import { useToast } from "@/hooks/use-toast";
import { createDiagnoses, fetchDiagnosesType } from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import DropdownList from "@/components/ui/DropdownList";
import { Icon } from "@/components/ui/icon";
import { ColumnDef } from "@tanstack/react-table";

// Debounce function with specific type for this use case
const debounce = (
  func: (searchTerm: string, index: number) => Promise<void>,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (searchTerm: string, index: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(searchTerm, index);
    }, delay);
  };
};

interface DiagnosisRow {
  diagnosis_Id: string;
  ICD_Code: string;
  notes: string;
  searchTerm: string;
}

const AddDiagnosesDialog = ({
  chartId,
  isOpen,
  userDetailsId,
  onClose,
}: {
  chartId: string;
  isOpen: boolean;
  userDetailsId: string;
  onClose: () => void;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);

  const [diagnosesTypeData, setDiagnosesTypeData] = useState<
    DiagnosesTypeData[]
  >([]);
  const [isListVisible, setIsListVisible] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [rows, setRows] = useState<DiagnosisRow[]>([
    { diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" },
  ]);

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

  const handleAddRow = useCallback(() => {
    setRows((prevRows) => [
      ...prevRows,
      { diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" },
    ]);
  }, []);

  const handleDeleteRow = useCallback(
    (index: number) => {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    },
    [rows]
  );

  const handleChange = useCallback(
    (index: number, field: keyof DiagnosisRow, value: string) => {
      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        )
      );
    },
    []
  );

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
    [setIsListVisible, setLoading, fetchDiagnosesType, setDiagnosesTypeData]
  );

  const handleSelectDiagnosis = useCallback(
    (diagnosis: DiagnosesTypeData, index: number) => {
      handleChange(index, "diagnosis_Id", diagnosis.id);
      handleChange(index, "ICD_Code", diagnosis.ICD_Code);
      handleChange(index, "searchTerm", diagnosis.diagnosis_name);
      setIsListVisible((prev) => {
        const newListVisible = [...prev];
        newListVisible[index] = false;
        return newListVisible;
      });

      // Add a new row and focus the input of the new row
      handleAddRow();
      setActiveInputIndex(rows.length); // Set the new row as active
    },
    [handleChange, handleAddRow, rows.length]
  );

  const handleClearRow = useCallback(
    (index: number) => {
      handleChange(index, "diagnosis_Id", "");
      handleChange(index, "ICD_Code", "");
      handleChange(index, "notes", "");
      handleChange(index, "searchTerm", "");
    },
    [handleChange]
  );

  const handleSubmit = async () => {
    try {
      if (chartId) {
        const requestData: CreateDiagnosesRequestBody = {
          userDetailsId,
          providerId: providerDetails.providerId,
          diagnoses: rows.map((row) => ({
            ...row,
            chartId,
          })),
        };
        await createDiagnoses({ requestData });
        showToast({
          toast,
          type: "success",
          message: "Diagnosis created successfully",
        });
      }
    } catch (e) {
      showToast({
        toast,
        type: "error",
        message: "Error while creating diagnosis",
      });
      console.log("Error", e);
    } finally {
      setRows([{ diagnosis_Id: "", ICD_Code: "", notes: "", searchTerm: "" }]);
      onClose();
    }
  };

  const columns: ColumnDef<DiagnosisRow>[] = useMemo(
    () => [
      {
        accessorKey: "diagnosis",
        header: "Diagnosis",
        cell: ({ row }) => (
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Enter Diagnosis"
              required
              value={
                diagnosesTypeData.find(
                  (d) => d.id === row.original.diagnosis_Id
                )?.diagnosis_name || row.original.searchTerm
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
              ref={(el) => {
                inputRefs.current[row.index] = el;
              }}
              onFocus={() => setActiveInputIndex(row.index)}
            />
            {isListVisible[row.index] && (
              <DropdownList
                items={diagnosesTypeData}
                renderItem={(diagnosis) => (
                  <div>
                    {diagnosis.diagnosis_name} ({diagnosis.ICD_Code})
                  </div>
                )}
                onSelect={(diagnosis) =>
                  handleSelectDiagnosis(
                    diagnosis as DiagnosesTypeData,
                    row.index
                  )
                }
              />
            )}
            {row.original.diagnosis_Id && (
              <Icon
                name="delete"
                className="cursor-pointer ml-2 text-red-500"
                onClick={() => handleClearRow(row.index)}
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "ICD_Code",
        header: "ICD Code",
        cell: ({ row }) => <div>{row.original.ICD_Code || "N/A"}</div>,
      },
      {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => (
          <Input
            type="text"
            placeholder="Enter notes"
            value={row.original.notes}
            onChange={(e) => handleChange(row.index, "notes", e.target.value)}
          />
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            onClick={() => handleDeleteRow(row.index)}
            disabled={!rows.length}
          >
            <Icon name="delete" className="cursor-pointer ml-2 text-red-500" />
          </Button>
        ),
      },
    ],
    [
      diagnosesTypeData,
      handleChange,
      handleSearch,
      isListVisible,
      rows.length,
      handleClearRow,
      handleDeleteRow,
      handleSelectDiagnosis,
    ]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        resetRows();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Diagnosis</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <DefaultDataTable
            columns={columns}
            data={rows}
            pageNo={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              resetRows();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDiagnosesDialog;

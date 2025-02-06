import GhostButton from "@/components/custom_buttons/GhostButton";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
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
  UserEncounterData,
} from "@/types/chartsInterface";
import { useToast } from "@/components/ui/use-toast";
import {
  createDiagnoses,
  createSOAPChart,
  updateSOAPChart,
} from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/SubmitButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AddDx = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [rows, setRows] = useState([
    { diagnosis_name: "", ICD_Code: "", notes: "" },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { diagnosis_name: "", ICD_Code: "", notes: "" }]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    console.log("Diagnoses:", rows);
    try {
      if (patientDetails.chart?.id) {
        const chartId = patientDetails.chart?.id;
        const requestData: CreateDiagnosesRequestBody = {
          userDetailsId: patientDetails.userDetails.id,
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
            userDetailsId: patientDetails.userDetails.id,
            providerId: providerDetails.providerId,
            diagnoses: rows.map((row) => ({
              ...row,
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
      setRows([{ diagnosis_name: "", ICD_Code: "", notes: "" }]);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <GhostButton label="Add Dx" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Diagnoses</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-32">Diagnosis</div>
            <div className="w-32">ICD Codes</div>
            <div className="w-32">Notes</div>
          </div>
          <div className="flex flex-col gap-2">
            {rows.map((row, index) => (
              <div className="flex justify-between" key={index}>
                <Input
                  type="text"
                  placeholder="Enter Diagnosis"
                  value={row.diagnosis_name}
                  onChange={(e) =>
                    handleChange(index, "diagnosis_name", e.target.value)
                  }
                  className="col-span-4 border rounded sm:max-w-32"
                />
                <Input
                  type="text"
                  placeholder="ICD Codes"
                  value={row.ICD_Code}
                  onChange={(e) =>
                    handleChange(index, "ICD_Code", e.target.value)
                  }
                  className="col-span-4 border rounded sm:max-w-32 "
                />
                <Input
                  type="text"
                  placeholder="Notes"
                  value={row.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                  className="col-span-3 border rounded sm:max-w-32"
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
              disabled={rows[0].diagnosis_name == "" ? true : false}
              onClick={handleSubmit}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDx;

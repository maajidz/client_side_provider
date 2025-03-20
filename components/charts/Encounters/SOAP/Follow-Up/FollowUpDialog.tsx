import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2Icon } from "lucide-react";
import { UserEncounterData } from "@/types/chartsInterface";
import { useToast } from "@/hooks/use-toast";
import {
  createFollowUp,
  createSOAPChart,
  updateSOAPChart,
} from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Icon } from "@/components/ui/icon";
import { ColumnDef } from "@tanstack/react-table";

interface Row {
  type: string;
  notes: string;
  sectionDateType: "after" | "before";
  sectionDateNumber: number;
  sectionDateUnit: "days" | "weeks" | "months";
  reminders: Array<"email" | "text" | "voice">;
}

const FollowUpDialog = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([
    {
      type: "",
      notes: "",
      sectionDateType: "after",
      sectionDateNumber: 0,
      sectionDateUnit: "weeks",
      reminders: [],
    },
  ]);

  // Separate state for editing
  const [editingStates, setEditingStates] = useState<{[key: string]: string | number | Array<"email" | "text" | "voice">}>({});
  
  const handleChange = (index: number, field: keyof Row, value: string) => {
    const key = `${index}-${field}`;
    setEditingStates(prev => ({...prev, [key]: value}));
  };

  // Debounced effect to update actual row data
  useEffect(() => {
    const timer = setTimeout(() => {
      setRows(currentRows => 
        currentRows.map((row, index) => {
          const updates: Partial<Row> = {};
          (Object.keys(row) as Array<keyof Row>).forEach(field => {
            const key = `${index}-${field}`;
            if (key in editingStates) {
              // TypeScript doesn't know that the value matches the field type
              // Using a safer approach with unknown as the intermediate step
              (updates as Record<string, unknown>)[field] = editingStates[key];
            }
          });
          return {...row, ...updates};
        })
      );
    }, 100);
    return () => clearTimeout(timer);
  }, [editingStates]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        type: "",
        notes: "",
        sectionDateType: "after",
        sectionDateNumber: 0,
        sectionDateUnit: "weeks",
        reminders: [],
      },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleReminderChange = (
    index: number,
    reminderType: "email" | "text" | "voice",
    value: boolean
  ) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        const updatedReminders = value
          ? [...new Set([...row.reminders, reminderType])]
          : row.reminders.filter((reminder) => reminder !== reminderType);
        return { ...row, reminders: updatedReminders };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    console.log("Follow-Up:", rows);
    try {
      if (patientDetails.chart?.id) {
        const chartId = patientDetails.chart?.id;

        const data = {
          plan: `Follow Up: ${rows.map((row) => row.type)}`,
          encounterId: encounterId,
        };

        updateSOAPChart({
          chartId,
          requestData: data,
        });
        showToast({ toast, type: "success", message: "Saved!" });
      } else {
        const data = {
          plan: `Follow Up: ${rows.map((row) => row.type)}`,
          encounterId: encounterId,
        };
        const response = await createSOAPChart({ requestData: data });
        if (response) {
          const chartId = response.id;
          const requestData = rows.map((row) => ({
            ...row,
            chartId,
          }));
          await createFollowUp({ requestData: requestData });
          showToast({ toast, type: "success", message: "Saved!" });
          setIsDialogOpen(false);
        }
      }
    } catch (e) {
      showToast({ toast, type: "error", message: "Error while saving" });
      console.log("Error", e);
      setIsDialogOpen(false);
    } finally {
      setRows([
        {
          type: "",
          notes: "",
          sectionDateType: "after",
          sectionDateNumber: 0,
          sectionDateUnit: "weeks",
          reminders: [],
        },
      ]);
      setIsDialogOpen(false);
    }
  };

  // Define columns for the DefaultDataTable
  const columns: ColumnDef<Row>[] = [
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row, getValue }) => (
        <Select
          value={getValue() as string}
          onValueChange={(value) => handleChange(row.index, "type", value)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Follow-Up Types</SelectLabel>
              <SelectItem value="Follow-Up Type 1">Follow-Up Type 1</SelectItem>
              <SelectItem value="Follow-Up Type 2">Follow-Up Type 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: ({ row, getValue }) => (
        <Textarea
          value={getValue() as string}
          rows={1}
          onChange={(e) =>
            handleChange(row.index, "notes", e.target.value)
          }
          placeholder="Enter notes"
          className="w-56"
        />
      ),
    },
    {
      header: "Date",
      accessorKey: "sectionDateType",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <Select
            value={row.original.sectionDateType}
            onValueChange={(value) =>
              handleChange(row.index, "sectionDateType", value)
            }
          >
            <SelectTrigger className="w-fit border rounded">
              <SelectValue placeholder="Select Date sectionDateUnit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="after">After</SelectItem>
                <SelectItem value="before">Before</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={row.original.sectionDateNumber}
            onChange={(e) =>
              handleChange(row.index, "sectionDateNumber", e.target.value)
            }
            className="w-16 border rounded"
          />
          <Select
            value={row.original.sectionDateUnit}
            onValueChange={(value) =>
              handleChange(row.index, "sectionDateUnit", value)
            }
          >
            <SelectTrigger className="w-fit border rounded">
              <SelectValue placeholder="Select sectionDateUnit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      header: "Reminder",
      accessorKey: "reminders",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2">
          <Checkbox
            label={<Icon name="email" />}
            tooltipLabel="Email"
            checked={row.original.reminders.includes("email")}
            onCheckedChange={(checked) =>
              handleReminderChange(row.index, "email", checked as boolean)
            }
          />

          <Checkbox
            label={<Icon name="message" />}
            tooltipLabel="Text"
            checked={row.original.reminders.includes("text")}
            onCheckedChange={(checked) =>
              handleReminderChange(row.index, "text", checked as boolean)
            }
          />

          <Checkbox
            label={<Icon name="phone" />}
            tooltipLabel="Voice"
            checked={row.original.reminders.includes("voice")}
            onCheckedChange={(checked) =>
              handleReminderChange(row.index, "voice", checked as boolean)
            }
          />
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => handleDeleteRow(row.index)}>
          <Trash2Icon />
        </Button>
      ),
    },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Add Follow up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Follow Up</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <DefaultDataTable
            columns={columns}
            data={rows}
            className="[&_td]:align-top"
            pageNo={1}
            totalPages={1}
          onPageChange={() => {}}
        />
        <Button variant={"link"} onClick={handleAddRow} className="self-start">
            Add More
          </Button>
        </div>
        <DialogFooter>
            <Button variant={"outline"}>Cancel</Button>
            <SubmitButton label="Save Changes" onClick={handleSubmit} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpDialog;

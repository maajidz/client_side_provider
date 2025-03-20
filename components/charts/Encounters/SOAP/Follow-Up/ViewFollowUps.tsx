import React, { useState } from "react";
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
import { FollowUpInterface, UserEncounterData } from "@/types/chartsInterface";
import { Save, Trash2Icon } from "lucide-react";
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
import {
  deleteFollowUp,
  getFollowUpData,
  updateFollowUp,
  updateSOAPChart,
} from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

const ViewFollowUps = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [prevFollowUps, setPrevFollowUps] = useState<FollowUpInterface[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchAndSetResponse = async () => {
    if (patientDetails.chart?.id) {
      setLoading(true);
      try {
        const response = await getFollowUpData({
          chartId: patientDetails.chart?.id,
        });
        if (response) {
          setPrevFollowUps(response);
          console.log("Prev", prevFollowUps);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDeleteFollowUps = async (followUpId: string) => {
    setLoading(true);
    try {
      await deleteFollowUp({ followUpId: followUpId });
      showToast({ toast, type: "success", message: "Deleted succesfully!" });
      setPrevFollowUps((prev) =>
        prev.filter((followUps) => followUps.id !== followUpId)
      );
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to delete Diagnosis",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedDiagnoses = [...prevFollowUps];
    updatedDiagnoses[index] = { ...updatedDiagnoses[index], [field]: value };
    setPrevFollowUps(updatedDiagnoses);
  };

  const handleReminderChange = (
    index: number,
    reminderType: "email" | "text" | "voice",
    value: boolean
  ) => {
    const updatedRows = prevFollowUps.map((row, i) => {
      if (i === index) {
        const updatedReminders = value
          ? [...new Set([...row.reminders, reminderType])]
          : row.reminders.filter((reminder) => reminder !== reminderType);
        return { ...row, reminders: updatedReminders };
      }
      return row;
    });
    setPrevFollowUps(updatedRows);
  };

  const handleUpdateFollowUp = async (
    followUpId: string,
    updatedData: FollowUpInterface
  ) => {
    setLoading(true);
    try {
      const requestBody = {
        type: updatedData.type,
        notes: updatedData.notes,
        sectionDateType: updatedData.sectionDateType,
        sectionDateNumber: updatedData.sectionDateNumber,
        sectionDateUnit: updatedData.sectionDateUnit,
        reminders: updatedData.reminders,
      };
      const response = await updateFollowUp({
        followUpId,
        requestData: requestBody,
      });
      const data = {
        plan: `Follow Up: ${requestBody.type}`,
        encounterId: encounterId,
      };
      updateSOAPChart({
        chartId: patientDetails.chart.id,
        requestData: data,
      });
      if (response) {
        showToast({ toast, type: "success", message: "Updated successfully!" });
        setPrevFollowUps((prev) =>
          prev.map((followUp) =>
            followUp.id === followUpId
              ? { ...followUp, ...updatedData }
              : followUp
          )
        );
      }
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to update Diagnosis",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  if (loading) {
    <div>
      <LoadingButton />
    </div>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={fetchAndSetResponse}>
          View Follow-ups
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>View Follow-ups</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="w-48">Type</div>
            <div className="w-56">Notes</div>
            <div className="w-60">Date</div>
            <div>Reminder</div>
            <div>Actions</div>
          </div>
          {prevFollowUps && prevFollowUps.length > 0 ? (
            prevFollowUps.map((followUp, index) => (
              <div key={index} className="flex justify-between">
                <Select
                  value={followUp.type}
                  onValueChange={(value) => handleChange(index, "type", value)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Follow-Up Types</SelectLabel>
                      <SelectItem value="Follow-Up Type 1">
                        Follow-Up Type 1
                      </SelectItem>
                      <SelectItem value="Follow-Up Type 2">
                        Follow-Up Type 2
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Textarea
                  value={followUp.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                  placeholder="Enter notes"
                  className="w-56"
                />
                <div className="flex gap-3">
                  <Select
                    value={followUp.sectionDateType}
                    onValueChange={(value) =>
                      handleChange(index, "sectionDateType", value)
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
                    value={followUp.sectionDateNumber}
                    onChange={(e) =>
                      handleChange(index, "sectionDateNumber", e.target.value)
                    }
                    className="w-16 border rounded"
                  />
                  <Select
                    value={followUp.sectionDateUnit}
                    onValueChange={(value) =>
                      handleChange(index, "sectionDateUnit", value)
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
                <div className="flex flex-col gap-3 ">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={followUp.reminders.includes("email")}
                      onCheckedChange={(checked) =>
                        handleReminderChange(index, "email", Boolean(checked))
                      }
                    />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={followUp.reminders.includes("text")}
                      onCheckedChange={(checked) =>
                        handleReminderChange(index, "text", Boolean(checked))
                      }
                    />
                    <span>Text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={followUp.reminders.includes("voice")}
                      onCheckedChange={(checked) =>
                        handleReminderChange(index, "voice", Boolean(checked))
                      }
                    />
                    <span>Voice</span>
                  </div>
                </div>
                <Button
                  variant={"ghost"}
                  onClick={() => handleDeleteFollowUps(followUp.id)}
                >
                  <Trash2Icon />
                </Button>
                <Button
                  variant="ghost"
                  type="submit"
                  className="text-[#84012A]"
                  onClick={() => handleUpdateFollowUp(followUp.id, followUp)}
                >
                  <Save />
                </Button>
              </div>
            ))
          ) : (
            <div>No Follow Ups Found</div>
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFollowUps;
